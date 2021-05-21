import express from 'express'
import passport from 'passport'

import { publishListedItem, unpublishListedItem, getListedItems } from '../controllers/market-controller.js'
import { multerUploadMultipleImages } from '../middleware/multer-middleware.js'

const router = express.Router()

router.post('/lps/:id/listforsale', passport.authenticate("jwt", { session: false }),
    multerUploadMultipleImages('image', 4), publishListedItem)
router.delete('/listedItems/:id', passport.authenticate("jwt", { session: false }), unpublishListedItem)
router.get('/listedItems', passport.authenticate("jwt", { session: false }), getListedItems)


export default router