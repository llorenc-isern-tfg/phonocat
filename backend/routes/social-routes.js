import express from 'express'
import passport from 'passport'

import { getUsers, getUserDetail } from '../controllers/social-controller.js'


const router = express.Router()

router.get('/users', passport.authenticate("jwt", { session: false }), getUsers)
router.get('/users/:username/', passport.authenticate("jwt", { session: false }), getUserDetail)


export default router