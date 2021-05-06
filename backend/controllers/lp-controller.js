import axios from 'axios'
import asyncHandler from 'express-async-handler'
import multer from 'multer'
import streamifier from 'streamifier';
import { getCode, getName } from 'country-list'

import Lp from '../models/lp-model.js'
import User from '../models/user-model.js';
import Artist from '../models/artist-model.js';
import cloudinary from '../config/cloudinary-config.js'
import { imgDataUri } from '../middleware/multer-middleware.js'

/**
 * @description Add LP to user collection
 * @route POST /users/{username}/lps/
 * @access Public
 */
const addLP = asyncHandler(async (req, res) => {
    console.log(req)

    const lp = new Lp({
        ...req.body,
        owner: req.user._id
    })

    const artistName = req.body.artist
    const artistMbid = req.body.artistMbid
    let artist = await Artist.findOne({ name: artistName })

    if (!artist) {
        console.log('ARTIST: ' + artistName, artistMbid)
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
 * @description Get LP list from user collection
 * @route GET /users/{username}/lps
 * @access Authenticated. If not logged in as requested user, only public LPs are returned
 */
const getLPs = asyncHandler(async (req, res) => {
    const paramUser = await User.findOne({ username: req.params.username })
    if (paramUser) {
        let lps = await Lp.find({ owner: paramUser.id }).populate('artist')
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
                isPublic: lp.isPublic
            })
        });
        res.send(lpsSummary)
    } else {
        res.status(404)
        throw new Error('Resource not found')
    }
})

/**
 * @description Get specific LP from user
 * @route GET /users/{username}/lps{id}
 * @access Authenticated. Logged in as LP owner if LP is not public
 */
const getLP = asyncHandler(async (req, res) => {
    const lp = await Lp.findById(req.params.id)
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
 * @description Edit LP
 * @route PATCH /users/{username}/lps{id}
 * @access Authenticated as LP owner
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
        updates.forEach((update) => lp[update] = req.body[update])
        await lp.save(req.body)
        res.send(lp)
    } else {
        res.status(404)
        throw new Error('LP not found')
    }
})

/**
 * @description Delete LP
 * @route DELETE /users/{username}/lps{id}
 * @access Authenticated as LP owner
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
    } else {
        res.status(404)
        throw new Error('LP not found')
    }
})


/**
 * @description Get external album data
 * @route DELETE /album/search
 * @access Authenticated 
 */
const getExternalData = asyncHandler(async (req, res) => {
    const filters = req.query;

    console.log(JSON.stringify(filters))
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
                genre: data.genres[0].toLowerCase(),
                country: getCode(data.country) ? getCode(data.country) : data.country,
                year: data.year,
                numDiscs: data.format_quantity,
                //enviem nomes un subset d'atributs de cada cançó
                trackList: data.tracklist.map(({ position, title, duration }) => ({ position, title, duration })),
                coverImg: topRelease.cover_image
            }
            console.log('HOLA2')
            res.send(lpPreloadedData)
        } else {
            res.status(404)
            throw new Error('Didn\t find any results')
        }
    } else {
        res.status(401)
        throw new Error('Inform at least the album title')
    }
})

/**
 * @description Delete LP
 * @route DELETE /users/{username}/lps{id}
 * @access Authenticated as LP owner
 */
const uploadLPCover = asyncHandler(async (req, res) => {
    const file = 'data:image/jpeg;base64,' + imgDataUri(req).content
    try {
        const response = await uploadImage(req.file.buffer)
        console.log(response)
        res.send(response)
    } catch (error) {
        console.log(error)
    }

})


// .upload(file, {
//     overwrite: true,
//     invalidate: true,
//     width: 810, height: 456, crop: "fill"
// }, (error, result) => {
//     if (error)
//         console.log(error)
//     else
//         res.send(result)
// })
// res.send('Image upload success')


const uploadImage = async (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'phonocat',
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            },
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}

export { addLP, getLPs, getLP, editLP, deleteLP, getExternalData, uploadLPCover }