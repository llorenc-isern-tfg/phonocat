import express from 'express'
import { addLP, getLPs, getLP, editLP, deleteLP } from '../controllers/lp-controller.js'
import passport from 'passport'

const router = express.Router()

router.post('/users/:username/lps', passport.authenticate("jwt", { session: false }), addLP)
router.get('/users/:username/lps', passport.authenticate("jwt", { session: false }), getLPs)
router.get('/users/:username/lps/:id', passport.authenticate("jwt", { session: false }), getLP)
router.patch('/users/:username/lps/:id', passport.authenticate("jwt", { session: false }), editLP)
router.delete('/users/:username/lps/:id', passport.authenticate("jwt", { session: false }), deleteLP)

export default router