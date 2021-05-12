import express from 'express'
import {
    registerUser, authUserJWT, authUserGoogle, getUserProfile, editUserProfile, loginUserGoogle,
    uploadProfilePicture
} from '../controllers/user-controller.js'
import passport from 'passport'

import { multerUploadSingleImage } from '../middleware/multer-middleware.js'

const router = express.Router()

router.post('/users', registerUser)
router.post('/users/login', authUserJWT)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authUserGoogle);
router.post('/login/google', loginUserGoogle)
router.route('/users/:username/profile').get(passport.authenticate("jwt", { session: false }), getUserProfile)
router.route('/users/:username/profile').patch(passport.authenticate("jwt", { session: false }), editUserProfile)
router.post('/users/:username/picture/', passport.authenticate("jwt", { session: false }),
    multerUploadSingleImage('picture'), uploadProfilePicture)


export default router