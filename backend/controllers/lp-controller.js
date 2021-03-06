import axios from 'axios'
import asyncHandler from 'express-async-handler'
import { getCode, getName } from 'country-list'

import Lp from '../models/lp-model.js'
import User from '../models/user-model.js';
import Artist from '../models/artist-model.js';
import {
    normalizeImageFormat, uploadImageBufferCloud,
    findExternalGenre, deleteImageCloud, findReleaseCountry
} from '../utils/utils.js'

/**
 * @description Afegir LP a la col·lecció
 * @route POST /users/{username}/lps/
 * @access Autenticat
 */
const addLP = asyncHandler(async (req, res) => {

    const lp = new Lp({
        ...req.body,
        owner: req.user._id
    })

    const artistName = req.body.artist
    const artistMbid = req.body.artistMbid
    let artist = await Artist.findOne({ name: artistName })

    if (!artist) {
        artist = new Artist({
            name: artistName,
            mbid: artistMbid
        })
        await artist.save()
    }

    lp.artist = artist.id

    await lp.save()

    res.status(201).send(lp)
});

/**
 * @description Obtenir col·lecció de LPs
 * @route GET /users/{username}/lps
 * @access Autenticat. Si no es l'usuari propietari nomes es retornen els discos publics
 */
const getLPs = asyncHandler(async (req, res) => {
    const paramUser = await User.findOne({ username: req.params.username })
    if (paramUser) {
        let lps = await Lp.find({ owner: paramUser.id })
            .sort('-createdAt')
            .populate('artist')
            .populate({ path: 'listedItem', select: 'wantedPrice status -lp', populate: { path: 'numPendingOffers' } })
        if (req.user.id !== paramUser.id) {
            lps = lps.filter((lp) => {
                lp.isPublic
            })
        }
        let lpsSummary = []
        lps.forEach(async lp => {
            lpsSummary.push({
                _id: lp._id,
                title: lp.title,
                genre: lp.genre,
                coverImg: lp.coverImg,
                artist: lp.artist.name,
                isPublic: lp.isPublic,
                isForSale: (lp.listedItem && lp.listedItem.status === 'available') ? true : false,
                listedItem: lp.listedItem
            })
        });
        res.send(lpsSummary)
    } else {
        res.status(404)
        throw new Error('Resource not found')
    }
})

/**
 * @description Obtenir detall d'un LP
 * @route GET /users/{username}/lps{id}
 * @access Autenticat com a propietari del LP
 */
const getLP = asyncHandler(async (req, res) => {
    const lp = await Lp.findById(req.params.id)
        .populate('artist')
        .populate({ path: 'listedItem', select: 'wantedPrice pictures -lp' })
    if (lp) {
        await lp.populate('owner').execPopulate()
        if (req.user.id !== lp.owner.id && !lp.isPublic) {
            res.status(403)
            throw new Error('Permission denied')
        }
        res.send(lp)
    } else {
        res.status(404)
        throw new Error('LP not found')
    }
})

/**
 * @description Editar LP
 * @route PATCH /users/{username}/lps{id}
 * @access Autenticat com a propietari del LP
 */
const editLP = asyncHandler(async (req, res) => {
    const lp = await Lp.findById(req.params.id)
    if (lp) {
        await lp.populate('owner').execPopulate()
        if (req.user.id !== lp.owner.id) {
            res.status(403)
            throw new Error('Permission denied')
        }
        const updates = Object.keys(req.body)
        const artistName = req.body.artist
        updates.forEach((update) => lp[update] = req.body[update])

        let artist = await Artist.findOne({ name: artistName })
        if (!artist) {
            artist = new Artist({
                name: artistName,
            })
            await artist.save()
        }

        lp.artist = artist.id

        await lp.save()
        res.send(lp)
    } else {
        res.status(404)
        throw new Error('LP not found')
    }
})

/**
 * @description Esborrar LP
 * @route DELETE /users/{username}/lps{id}
 * @access Autenticat com a propietari del LP
 */
const deleteLP = asyncHandler(async (req, res) => {
    const lp = await Lp.findById(req.params.id)
    if (lp) {
        await lp.populate('owner').execPopulate()
        if (req.user.id !== lp.owner.id) {
            res.status(403)
            throw new Error('Permission denied')
        }
        await lp.delete()
        res.send({ message: 'LP removed' })
        //esborrem la imatge de la portada del cloud, no fem await per agilitat
        deleteImageCloud(`phonocat/covers/${req.params.id}`)
    } else {
        res.status(404)
        throw new Error('LP not found')
    }
})


/**
 * @description Obtenir dades externes d'un LP
 * @route DELETE /album/search
 * @access Autenticat
 */
const getExternalData = asyncHandler(async (req, res) => {
    const filters = req.query;

    if (filters.title) {
        const searchData = await axios.get(`${process.env.DISCOGS_API_URL}/database/search`, {
            params: {
                key: process.env.DISCOGS_API_KEY,
                secret: process.env.DISCOGS_API_SECRET,
                release_title: filters.title,
                artist: filters.artist,
                format: 'Vinyl',
                type: 'release',
                per_page: 100,
                page: 1
            }
        })

        if (searchData.data.results.length > 0) {

            //agafem el resultat més popular
            const topRelease = searchData.data.results.reduce(function (r1, r2) {
                return r1.community.want > r2.community.want ? r1 : r2
            })

            //consultem el detall de la edició més popular
            const { data } = await axios.get(`${process.env.DISCOGS_API_URL}/releases/${topRelease.id}`, {
                params: {
                    key: process.env.DISCOGS_API_KEY,
                    secret: process.env.DISCOGS_API_SECRET
                }
            })

            const lpPreloadedData = {
                title: filters.title,
                artist: filters.artist ? filters.artist : data.artist[0].name,
                label: data.labels[0].name,
                genre: findExternalGenre(data.genres[0]),
                country: getCode(data.country) ? getCode(data.country) : findReleaseCountry(data.country),
                year: data.year,
                numDiscs: data.format_quantity,
                //enviem nomes un subset d'atributs de cada cançó
                trackList: data.tracklist.map(({ position, title, duration }) => ({ position, title, duration })),
                coverImg: topRelease.cover_image
            }

            res.send(lpPreloadedData)
        } else {
            res.status(404)
            throw new Error('Didn\t find any results')
        }
    } else {
        res.status(400)
        throw new Error('Inform at least the album title')
    }
})

/**
 * @description Pujar una portada d'un LP, accepta fitxer o URL
 * @route DELETE /users/{username}/lps{id}
 * @access Autenticat com a propietari del LP
 */
const uploadLPCover = asyncHandler(async (req, res) => {
    //només pot pujar la portada el propietari del lp
    const lp = await Lp.findById(req.params.id)
    if (lp) {
        await lp.populate('owner').execPopulate()
        if (req.user.id !== lp.owner.id) {
            res.status(403)
            throw new Error('Permission denied')
        }

        const method = req.body.method
        let processedImageBuffer
        switch (method) {
            case 'file':
                //es pre-processa la imatge amb la llibreria sharp per mantenir un format comú a les caràtules
                processedImageBuffer = await normalizeImageFormat(req.file.buffer)
                break
            case 'url':
                const coverUrl = req.body.cover
                if (!coverUrl)
                    throw new Error('Invalid arguments')
                const imageResponse = await axios({ url: coverUrl, responseType: 'arraybuffer' })
                const buffer = Buffer.from(imageResponse.data, 'binary')
                processedImageBuffer = await normalizeImageFormat(buffer)
                break
            default:
                throw new Error('Must provide file or url method')

        }
        //S'envia la imatge al cloud de cloudinary i s'emmagatzema la url resultant a bdd
        const cloudinaryResponse = await uploadImageBufferCloud(processedImageBuffer, 'phonocat/covers', req.params.id)
        lp.coverImg = cloudinaryResponse.secure_url

        await lp.save()

        res.send({
            message: 'upload success',
            id: lp.id,
            coverImg: lp.coverImg
        })

    } else {
        res.status(404)
        throw new Error('LP not found')
    }

})

export { addLP, getLPs, getLP, editLP, deleteLP, getExternalData, uploadLPCover }