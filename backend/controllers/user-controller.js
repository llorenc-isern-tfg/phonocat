import asyncHandler from 'express-async-handler'
import { OAuth2Client } from 'google-auth-library'
import _ from 'lodash'

import User from '../models/user-model.js'
import * as utils from '../utils/utils.js'
import { normalizeImageFormat, uploadImageBufferCloud } from '../utils/utils.js'

/**
 * @description Registrar usuari
 * @route POST /users
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { email, username } = req.body
  const emailExists = await User.findOne({ email })
  if (emailExists) {
    res.status(409)
    throw new Error('User email already exists')
  }

  const nameExists = await User.findOne({ username: new RegExp(`^${username}$`, 'i') })
  if (nameExists) {
    console.log('name exists')
    res.status(409)
    throw new Error('User name already exists')
  }

  const user = new User(req.body)
  try {
    await user.save()

    res.send({
      id: user._id,
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
 * @description Autenticar usuari i obtenir token JWT
 * @route POST /users/login
 * @access Public
 */
const authUserJWT = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.comparePassword(password))) {
    const token = utils.createToken(user._id)

    res.send({
      id: user._id,
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
 * @description Autenticar usuari amb google passport i obtenir token JWT 
 * @route POST /users/login
 * @access Public
 */
const authUserGoogle = asyncHandler(async (req, res) => {
  const user = await User.findOne({ googleId: req.user.googleId })
  if (user) {
    const token = utils.createToken(user._id)
    res.send({ user, token })
  } else {
    res.status(401)
    throw new Error('Unauthorized')
  }
})

/**
 * @description Autenticar usuari amb google auth lib i obtenir token JWT 
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
    id: googleUser._id,
    username: googleUser.username,
    email: googleUser.email,
    picture: googleUser.picture,
    language: googleUser.language,
    token: utils.createToken(googleUser._id)
  })

})

/**
 * @description Obtenir perfil d'usuari
 * @route GET /users/profile/{username}
 * @access Autenticat. Si no es l'usuari autenticat nomes es retornen dades publiques
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
 * @description Editar perfil d'usuari
 * @route PATCH /users/profile/{username}
 * @access Autenticat com a l'usuari a editar
 */
const editUserProfile = asyncHandler(async (req, res) => {
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
 * @description Pujar una imatge de perfil
 * @route DELETE /users/{username}/picture
 * @access Autenticat com a l'usuari a modificar
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
