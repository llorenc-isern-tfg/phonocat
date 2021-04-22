import asyncHandler from 'express-async-handler'
import User from '../models/user-model.js'
import * as utils from '../utils/utils.js'

/**
 * @description Register user
 * @route POST /users
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body
  const emailExists = await User.findOne({ email })
  if (emailExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send(user)
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
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.comparePassword(password))) {
    const token = utils.createToken(user._id)

    res.send({
      username: user.username,
      email: user.email,
      profilePic: user.profilePictureUrl,
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
  } else {
    res.status(401)
    throw new Error('Unauthorized')
  }
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
  const paramUser = await User.findOne({ username: req.params.username })
  if (paramUser) {
    if (req.user.id == paramUser.id) {
      const updatableFields = [
        'password',
        'birthDate',
        'phoneNumber',
        'profilePictureUrl',
        'language',
        'address',
      ]
      //TODO: Desar usuari
      res.send(user)
    } else {
      res.status(403)
      throw new Error('Permission denied')
    }
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


export { registerUser, authUserJWT, authUserGoogle, getUserProfile, editUserProfile }
