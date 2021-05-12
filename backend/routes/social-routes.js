import express from 'express'
import passport from 'passport'

import { getUsers } from '../controllers/social-controller.js'


const router = express.Router()

router.get('/users', passport.authenticate("jwt", { session: false }), getUsers)


export default router