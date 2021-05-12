import asyncHandler from 'express-async-handler'
import { OAuth2Client } from 'google-auth-library'
import _ from 'lodash'

import User from '../models/user-model.js'
import * as utils from '../utils/utils.js'
import { normalizeImageFormat, uploadImageBufferCloud } from '../utils/utils.js'

/**
 * @description Register user
 * @route POST /users
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { email, username } = req.body
  const emailExists = await User.findOne({ email })
  if (emailExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const nameExists = await User.findOne({ username })
  if (nameExists) {
    res.status(400)
    throw new Error('User name already exists')
  }
  console.log(req.body)
  const user = new User(req.body)
  console.log(user)
  try {
    await user.save()

    res.send({
      username: user.username,
      email: user.email,
      picture: user.picture,
      language: user.language,
      token: utils.createToken(user._id)
    })

  } catch (e) {
    res.status(400).send(e)
  }
})

/**
 * @description Auth user and get JWT token
 * @route POST /users/login
 * @access Public
 */
const authUserJWT = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.comparePassword(password))) {
    const token = utils.createToken(user._id)

    res.send({
      username: user.username,
      email: user.email,
      picture: user.picture,
      language: user.language,
      token: token
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
  }
})

/**
 * @description Auth user with google and get JWT token
 * @route POST /users/login
 * @access Public
 */
const authUserGoogle = asyncHandler(async (req, res) => {
  const user = await User.findOne({ googleId: req.user.googleId })
  if (user) {
    const token = utils.createToken(user._id)
    res.send({ user, token })
    console.log('TOKEN: ' + token)
    // res.redirect(`http://localhost:3000/?username=${user.username}&email=${user.email}&token=${token}`);
  } else {
    res.status(401)
    throw new Error('Unauthorized')
  }
})

/**
 * @description Login user with google token and get JWT token
 * @route POST /users/login
 * @access Public
 */
const loginUserGoogle = asyncHandler(async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID)
  const { id_token } = req.body

  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_OAUTH_CLIENT_ID
  })

  console.log(ticket.getPayload())

  const { sub, email, given_name, picture } = ticket.getPayload()

  let googleUser = await User.findOne({ googleId: sub })
  if (!googleUser) {
    //primer acces, creem un usuari i vinculem l'id de google
    //farem servir el nom del perfil de google amb l'id de google com a sufix per evitar duplicats
    let username = given_name.split(" ")[0]
    if (await User.findOne({ username }))
      username += `_${sub}`

    googleUser = await new User({
      username,
      googleId: sub,
      email: email,
      picture: picture
    }).save()
  }

  res.send({
    username: googleUser.username,
    email: googleUser.email,
    picture: googleUser.picture,
    language: googleUser.language,
    token: utils.createToken(googleUser._id)
  })

})

/**
 * @description Get user profile
 * @route GET /users/profile/{username}
 * @access Authenticated. If not logged in as requested user, only public data is returned
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const paramUser = await User.findOne({ username: req.params.username })
  if (paramUser) {
    res.send(req.user.id !== paramUser.id ? paramUser.publicProfile() : paramUser)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

/**
 * @description Edit user profile
 * @route PATCH /users/profile/{username}
 * @access Authenticated as requested user
 */
const editUserProfile = asyncHandler(async (req, res) => {
  console.log(req.body)
  const paramUser = await User.findOne({ username: req.params.username })
  if (paramUser) {
    if (req.user.id == paramUser.id) {
      const updates = Object.keys(req.body)
      updates.forEach((update) => paramUser[update] = req.body[update])
      await paramUser.save()
      res.send(paramUser)
    } else {
      res.status(403)
      throw new Error('Permission denied')
    }
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

/**
 * @description Upload LP cover accepts file or url
 * @route DELETE /users/{username}/lps{id}
 * @access Authenticated as LP owner
 */
const uploadProfilePicture = asyncHandler(async (req, res) => {

  let paramUser = await User.findOne({ username: req.params.username })
  if (paramUser) {
    if (req.user.id == paramUser.id) {
      const processedImageBuffer = await normalizeImageFormat(req.file.buffer)
      //S'envia la imatge al cloud de cloudinary i s'emmagatzema la url resultant a bdd
      const cloudinaryResponse = await uploadImageBufferCloud(processedImageBuffer, 'phonocat/users', paramUser.username)
      paramUser.picture = cloudinaryResponse.secure_url
      await paramUser.save()

      res.send({
        message: 'upload success',
        username: paramUser.username,
        url: paramUser.picture
      })
    } else {
      res.status(403)
      throw new Error('Permission denied')
    }
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


export { registerUser, authUserJWT, authUserGoogle, getUserProfile, editUserProfile, loginUserGoogle, uploadProfilePicture }
