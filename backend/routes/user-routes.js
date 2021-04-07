import express from 'express'
import { registerUser, authUserJWT, authUserGoogle, getUserProfile, editUserProfile } from '../controllers/user-controller.js'
import passport from 'passport'

const router = express.Router()

router.post('/users', registerUser)
router.post('/users/login', authUserJWT)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users/login' }), authUserGoogle);
router.route('/users/:username/profile').get(passport.authenticate("jwt", { session: false }), getUserProfile)
router.route('/users/:username/profile').patch(passport.authenticate("jwt", { session: false }), editUserProfile)


export default router