import asyncHandler from 'express-async-handler'
import _ from 'lodash'

import Lp from '../models/lp-model.js'
import ListedItem, { aggregatedListedItems } from '../models/listed-item-model.js'
import Offer, { aggregatedReceivedOffers } from '../models/offer-model.js'
import {
    normalizeImageFormat, uploadImageBufferCloud, deleteImageCloud, validateEurCurrency
} from '../utils/utils.js'

/**
 * @description Publicar un anunci de venda
 * @route POST /lps/{id}/listforsale
 * @access Autenticat com a propietari del LP
 */
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
        if (listedItem) {
            res.status(405)
            throw new Error(`Lp is already listed for sale`)
        }

        const wantedPrice = req.body.wantedPrice
        if (!wantedPrice) {
            res.status(400)
            throw new Error('Wanted price required')
        }

        if (!validateEurCurrency(wantedPrice)) {
            res.status(400)
            throw new Error('Invalid price format')
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

/**
 * @description Retirar un anunci de venda
 * @route DELETE /market/listedItems/:id
 * @access Autenticat com a propietari del LP
 */
const unpublishListedItem = asyncHandler(async (req, res) => {
    //només pot pujar la portada el propietari del lp
    const listedItem = await ListedItem.findById(req.params.id).populate('lp')
    if (listedItem) {
        await listedItem.lp.populate('owner').execPopulate()
        if (req.user.id !== listedItem.lp.owner.id) {
            res.status(403)
            throw new Error('Permission denied')
        }

        //Rebutjar ofertes relacionades
        await Offer.updateMany({ listedItem: listedItem._id }, { "$set": { "status": 'rejected' } })

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

    const { page = 0, limit = 25, sortBy = 'createdAt', sortOrder = 'desc', genre, minPrice, maxPrice } = req.query

    //construïm objecte per ordenar
    let sort = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    //construïm filtres
    let filter = {}
    if (genre)
        filter['lp.genre'] = genre
    if (minPrice)
        filter['wantedPrice'] = { $gt: Number(minPrice) }
    if (maxPrice)
        filter['wantedPrice'] = { ...filter['wantedPrice'], $lt: Number(maxPrice) }

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

/**
 * @description Fer una oferta a un LP en venda
 * @route POST /listedItems/{id}/offer/
 * @access Autenticat
 */
const makeOffer = asyncHandler(async (req, res) => {

    const listedItem = await ListedItem.findById(req.params.id)

    if (listedItem) {

        //Validem que l'article continua disponible
        if (listedItem.status !== 'available') {
            res.status(405)
            throw new Error('Item is no longer available')
        }

        await listedItem.populate({ path: 'lp', populate: { path: 'owner' } }).execPopulate()

        //Validem que l'usuari que fa la oferta no sigui l'usuari propietari
        if (listedItem.lp.owner.id === req.user.id) {
            res.status(405)
            throw new Error('Permission denied')
        }

        //Validem que l'usuari no hagi fet ja una oferta per aquest article que estigui aprovada o pendent
        const existingOffer = await Offer.findOne({
            listedItem: listedItem.id,
            buyer: req.user.id,
            status: { "$in": ['pending', 'accepted'] }
        })
        if (existingOffer) {
            res.status(405)
            throw new Error('You have already sent an offer for this article')
        }

        //Validem que la oferta té un import i que és vàlid
        const suggestedPrice = req.body.suggestedPrice
        if (!suggestedPrice) {
            res.status(400)
            throw new Error('Suggested price required')
        }
        if (!validateEurCurrency(suggestedPrice)) {
            res.status(400)
            throw new Error('Invalid price format')
        }

        const offer = new Offer(
            {
                listedItem: listedItem.id,
                suggestedPrice,
                seller: listedItem.lp.owner.id,
                buyer: req.user.id,
                status: 'pending'
            }
        )
        await offer.save()

        res.send({
            status: 'success',
            msg: 'Offer sended',
            offer
        })
    } else {
        res.status(404)
        throw new Error('Item not found')
    }
})

/**
 * @description Obtenir ofertes rebudes
 * @route GET /market/offers/received
 * @access Autenticat
 */
const getReceivedOffers = asyncHandler(async (req, res) => {

    //Per poder agrupar les ofertes rebudes per lp cal fer servir aggregate amb els camps i col·leccions necessaries
    let receivedOffers = await aggregatedReceivedOffers(req.user._id)

    res.send(receivedOffers)

})

/**
 * @description Obtenir ofertes realitzades
 * @route GET /market/offers/sended
 * @access Autenticat
 */
const getSendedOffers = asyncHandler(async (req, res) => {
    const sendedOffers = await Offer.find({ buyer: req.user._id }).sort('-createdAt')
        .populate({ path: 'listedItem', select: 'wantedPrice lp status', populate: { path: 'lp', select: 'title artist coverImg', populate: { path: 'artist' } } })

    res.send(sendedOffers)

})

/**
 * @description Rebutjar oferta
 * @route PATCH /market/offers/:id/reject
 * @access Autenticat com a venedor del LP relacionat
 */
const rejectOffer = asyncHandler(async (req, res) => {
    const offer = await Offer.findById(req.params.id)

    if (offer) {

        //Validem que la oferta encara es troba en estat pendent
        if (offer.status !== 'pending') {
            res.status(405)
            throw new Error('Invalid offer status')
        }

        await offer.populate('seller').execPopulate()

        //Validem que l'usuari propietari sigui qui modifica l'estat de la oferta
        if (offer.seller.id !== req.user.id) {
            res.status(405)
            throw new Error('Permission denied')
        }

        offer.status = 'rejected'
        await offer.save()

        res.send({
            status: 'success',
            msg: 'Offer rejected',
            offer
        })
    } else {
        res.status(404)
        throw new Error('Offer not found')
    }

})

/**
 * @description Acceptar oferta
 * @route PATCH /market/offers/:id/accept
 * @access Autenticat com a venedor del LP relacionat
 */
const acceptOffer = asyncHandler(async (req, res) => {
    const offer = await Offer.findById(req.params.id)

    if (offer) {

        //Validem que la oferta encara es troba en estat pendent
        if (offer.status !== 'pending') {
            res.status(405)
            throw new Error('Invalid offer status')
        }

        await offer.populate('seller').execPopulate()

        //Validem que l'usuari propietari sigui qui modifica l'estat de la oferta
        if (offer.seller.id !== req.user.id) {
            res.status(405)
            throw new Error('Permission denied')
        }

        //Validem que l'usuari no hi hagi una altra oferta acceptada per aquest article
        const existingAcceptedOffer = await Offer.findOne({
            listedItem: offer.listedItem.id,
            status: 'accepted'
        })
        if (existingAcceptedOffer) {
            res.status(405)
            throw new Error('You have already accepted an offer for this item')
        }

        //Rebutjem la resta d'ofertes pendents
        await Offer.updateMany({ listedItem: offer.listedItem._id }, { "$set": { "status": 'rejected' } })

        await offer.populate('listedItem').execPopulate()

        offer.listedItem.status = 'reserved'
        await offer.listedItem.save()

        //Desem el nou estat de la oferta
        offer.status = 'accepted'
        await offer.save()

        res.send({
            status: 'success',
            msg: 'Offer rejected',
            offer
        })
    } else {
        res.status(404)
        throw new Error('Offer not found')
    }

})

/**
 * @description Valorar transacció
 * @route PATCH /market/offers/:id/rate
 * @access Autenticat com a venedor del LP relacionat o com a comprador 
 */
const rateOffer = asyncHandler(async (req, res) => {
    const offer = await Offer.findById(req.params.id)
    if (offer) {

        const score = req.body.score
        if (!score) {
            res.status(400)
            throw new Error('Invalid params, score is mandatory')
        }

        //Validem que la oferta encara es troba en estat pendent
        if (offer.status !== 'accepted') {
            res.status(405)
            throw new Error('Invalid offer status')
        }

        await offer.populate('seller').populate('buyer').execPopulate()

        //Validem que l'usuari sigui el comprador o el venedor
        if (offer.seller.id !== req.user.id && offer.buyer.id !== req.user.id) {
            res.status(405)
            throw new Error('Permission denied')
        }

        if (offer.seller.id === req.user.id) {
            if (offer.sellerReview) {
                res.status(405)
                throw new Error('You have already rated this transaction')
            }

            offer.sellerReview = {
                rating: score
            }

            await offer.save()

        }

        if (offer.buyer.id === req.user.id) {
            if (offer.buyerReview) {
                res.status(405)
                throw new Error('You have already rated this transaction')
            }

            offer.buyerReview = {
                rating: score
            }

            await offer.save()

        }

        if (offer.sellerReview && offer.buyerReview) {
            //Si els dos usuaris han valorat la transacció cambiem el LP de propietari
            await offer.populate({ path: 'listedItem', populate: { path: 'lp' } }).execPopulate()
            offer.listedItem.status = 'sold'
            await offer.listedItem.save()
            offer.listedItem.lp.owner = offer.buyer._id
            await offer.listedItem.lp.save()
        }

        res.send({
            status: 'success',
            msg: 'Transaction rated',
            offer
        })
    } else {
        res.status(404)
        throw new Error('Offer not found')
    }

})


export {
    publishListedItem, unpublishListedItem, getListedItems,
    makeOffer, getReceivedOffers, getSendedOffers, rejectOffer,
    acceptOffer, rateOffer
}