import express from 'express'
import passport from 'passport'

import { publishListedItem } from '../controllers/market-controller.js'
import { multerUploadMultipleImages } from '../middleware/multer-middleware.js'

const router = express.Router()

router.post('/listedItems/:id', passport.authenticate("jwt", { session: false }),
    multerUploadMultipleImages('image', 4), publishListedItem)


export default router