import express from 'express'
import passport from 'passport'

import { addLP, getLPs, getLP, editLP, deleteLP, getExternalData, uploadLPCover } from '../controllers/lp-controller.js'
import { multerUploadSingleImage } from '../middleware/multer-middleware.js'

const router = express.Router()

router.post('/users/:username/lps', passport.authenticate("jwt", { session: false }), addLP)
router.get('/users/:username/lps', passport.authenticate("jwt", { session: false }), getLPs)
router.get('/users/:username/lps/:id', passport.authenticate("jwt", { session: false }), getLP)
router.patch('/users/:username/lps/:id', passport.authenticate("jwt", { session: false }), editLP)
router.delete('/users/:username/lps/:id', passport.authenticate("jwt", { session: false }), deleteLP)
router.post('/lps/:id/cover/', passport.authenticate("jwt", { session: false }),
    multerUploadSingleImage('cover'), uploadLPCover)

//Configurem una ruta per recuperar dades externes d'un disc
router.get('/album/search', passport.authenticate("jwt", { session: false }), getExternalData)


export default router