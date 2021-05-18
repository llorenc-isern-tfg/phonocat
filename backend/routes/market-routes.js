import express from 'express'
import passport from 'passport'

import { publishListedItem, unpublishListedItem } from '../controllers/market-controller.js'
import { multerUploadMultipleImages } from '../middleware/multer-middleware.js'

const router = express.Router()

router.post('/lps/:id/listforsale', passport.authenticate("jwt", { session: false }),
    multerUploadMultipleImages('image', 4), publishListedItem)
router.delete('/listedItems/:id', passport.authenticate("jwt", { session: false }), unpublishListedItem)


export default router