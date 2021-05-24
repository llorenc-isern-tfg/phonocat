import express from 'express'
import passport from 'passport'

import {
    publishListedItem, unpublishListedItem, getListedItems,
    makeOffer, getReceivedOffers, getSendedOffers,
    rejectOffer, acceptOffer, rateOffer
} from '../controllers/market-controller.js'
import { multerUploadMultipleImages } from '../middleware/multer-middleware.js'

const router = express.Router()

router.post('/lps/:id/listforsale', passport.authenticate("jwt", { session: false }),
    multerUploadMultipleImages('image', 4), publishListedItem)
router.delete('/market/listedItems/:id', passport.authenticate("jwt", { session: false }), unpublishListedItem)
router.get('/market/listedItems', passport.authenticate("jwt", { session: false }), getListedItems)
router.post('/market/listedItems/:id/offer', passport.authenticate("jwt", { session: false }), makeOffer)
router.get('/market/offers/received', passport.authenticate("jwt", { session: false }), getReceivedOffers)
router.get('/market/offers/sended', passport.authenticate("jwt", { session: false }), getSendedOffers)
router.patch('/market/offers/:id/reject', passport.authenticate("jwt", { session: false }), rejectOffer)
router.patch('/market/offers/:id/accept', passport.authenticate("jwt", { session: false }), acceptOffer)
router.patch('/market/offers/:id/rate', passport.authenticate("jwt", { session: false }), rateOffer)


export default router