import asyncHandler from 'express-async-handler'
import _ from 'lodash'

import Lp from '../models/lp-model.js'
import ListedItem, { aggregatedListedItems } from '../models/listed-item-model.js'
import {
    normalizeImageFormat, uploadImageBufferCloud, deleteImageCloud
} from '../utils/utils.js'

const publishListedItem = asyncHandler(async (req, res) => {
    //només pot pujar la portada el propietari del lp
    const lp = await Lp.findById(req.params.id)
    if (lp) {
        await lp.populate('owner').execPopulate()
        if (req.user.id !== lp.owner.id) {
            res.status(403)
            throw new Error('Permission denied')
        }

        let listedItem = await ListedItem.findOne({ lp: lp._id })
        console.log(listedItem)
        if (listedItem) {
            res.status(405)
            throw new Error(`Lp is already listed for sale`)
        }

        const wantedPrice = req.body.wantedPrice
        if (!wantedPrice) {
            res.status(400)
            throw new Error('Wanted price required')
        }

        listedItem = new ListedItem({
            lp: lp._id,
            wantedPrice,
            pictures: []
        })

        await Promise.all(req.files.map(async (file, i) => {
            //es pre-processa la imatge amb la llibreria sharp per mantenir un format comú a les caràtules
            const processedImageBuffer = await normalizeImageFormat(file.buffer)
            //S'envia la imatge al cloud de cloudinary i s'emmagatzema la url resultant a bdd
            const cloudinaryResponse = await uploadImageBufferCloud(processedImageBuffer, 'phonocat/listedItems', `${listedItem._id}_${i}`)
            listedItem.pictures.push(cloudinaryResponse.secure_url)
        }))

        await listedItem.save()

        res.send({
            message: 'success',
            listedItem
        })

    } else {
        res.status(404)
        throw new Error('LP not found')
    }

})

const unpublishListedItem = asyncHandler(async (req, res) => {
    //només pot pujar la portada el propietari del lp
    const listedItem = await ListedItem.findById(req.params.id).populate('lp')
    if (listedItem) {
        await listedItem.lp.populate('owner').execPopulate()
        if (req.user.id !== listedItem.lp.owner.id) {
            res.status(403)
            throw new Error('Permission denied')
        }

        //TODO: esborrar ofertes relacionades

        await listedItem.delete()

        res.send({
            status: 'success',
            msg: 'Lp is no longer for sale',
            listedItemId: listedItem._id
        })

        //esborrem les imatges de l'anunci allotjades al cloud, no esperem la resposta per guanyar agilitat
        listedItem.pictures.map((picture, i) =>
            deleteImageCloud(`phonocat/listedItems/${listedItem._id}_${i}`)
        )

    } else {
        res.status(404)
        throw new Error('Listed item not found')
    }

})

/**
 * @description Obtenir llistat de discos en venda
 * @route GET /listedItems/
 * @access Autenticat.
 */
const getListedItems = asyncHandler(async (req, res) => {

    console.log(req.query)

    const { page = 0, limit = 25, sortBy = 'createdAt', sortOrder = 'desc', genre, minPrice, maxPrice } = req.query

    //construïm objecte per ordenar
    let sort = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1
    console.log(sort)

    //construïm filtres
    let filter = {}
    if (genre)
        filter['lp.genre'] = genre
    if (minPrice)
        filter['wantedPrice'] = { $gt: Number(minPrice) }
    if (maxPrice)
        filter['wantedPrice'] = { ...filter['wantedPrice'], $lt: Number(maxPrice) }

    console.log(filter)

    const offset = page ? page * limit : 0

    const customLabels = {
        totalDocs: 'totalItems',
        docs: 'listedItems',
        meta: 'pagination',
    }

    var options = {
        page,
        offset,
        limit,
        customLabels
    }


    //Per poder filtar i ordenar per subdocuments cal fer servir aggregates amb els camps i col·leccions necessaries
    let listedItems = await ListedItem.aggregatePaginate(aggregatedListedItems(sort, filter), options)

    //encapsulem els atributs de paginació en un objecte
    listedItems.pagination = {
        totalItems: listedItems.totalItems,
        limit: listedItems.limit,
        page: listedItems.page,
        totalPages: listedItems.totalPages,
        pagingCounter: listedItems.pagingCounter,
        hasPrevPage: listedItems.hasPrevPage,
        hasNextPage: listedItems.hasNextPage,
        offset: listedItems.offset,
        prevPage: listedItems.prevPage,
        nextPage: listedItems.nextPage
    }
    listedItems = _.pick(listedItems, ['listedItems', 'pagination'])

    //Adicionalment retornem el preu màxim de tots els LP en venda per facilitar les opcions de filtratge
    listedItems.filterHelper = {}
    const leastExpensive = await ListedItem.findOne({}).sort({ "wantedPrice": 1 })
    if (leastExpensive)
        listedItems.filterHelper.leastExpensive = leastExpensive.wantedPrice
    const mostExpensive = await ListedItem.findOne({}).sort({ "wantedPrice": -1 })
    if (mostExpensive)
        listedItems.filterHelper.mostExpensive = mostExpensive.wantedPrice


    res.send(listedItems)

})


export { publishListedItem, unpublishListedItem, getListedItems }