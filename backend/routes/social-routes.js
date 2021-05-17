import express from 'express'
import passport from 'passport'

import { getUsers, getUserDetail, followUser, unfollowUser } from '../controllers/social-controller.js'


const router = express.Router()

router.get('/users', passport.authenticate("jwt", { session: false }), getUsers)
router.get('/users/:username', passport.authenticate("jwt", { session: false }), getUserDetail)
router.post('/users/:username/follow', passport.authenticate("jwt", { session: false }), followUser)
router.delete('/users/:username/unfollow', passport.authenticate("jwt", { session: false }), unfollowUser)


export default router