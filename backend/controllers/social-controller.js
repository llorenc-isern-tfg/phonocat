import asyncHandler from 'express-async-handler'
import _ from 'lodash'

import User from '../models/user-model.js'
import Lp from '../models/lp-model.js'
import Following from '../models/following-model.js'


/**
 * @description Obtenir llistat d'usuaris
 * @route GET /users/{username}
 * @access Autenticat. Nomès es retornen les dades públiques dels usuaris
 */
const getUsers = asyncHandler(async (req, res) => {

    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 50
    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder || -1
    const offset = page ? page * limit : 0

    //versió manual

    // const users = await User.find({}, 'username bio picture country')
    //     .skip(offset)
    //     .limit(limit)
    //     .sort({ sortBy: sortOrder })
    //     .populate('numLps').populate({ path: 'latestLps', select: 'owner title coverImg' })

    // let numUsers = await User.countDocuments();

    // res.send({
    //     totalPages: Math.ceil(numUsers / limit),
    //     numItems: numUsers,
    //     page,
    //     limit,
    //     users
    // })

    //versió amb mongoose-paginate-v2

    const customLabels = {
        totalDocs: 'totalUsers',
        docs: 'users',
        meta: 'pagination',
    }

    var options = {
        select: 'username bio picture country createdAt',
        sort: sortOrder === -1 && '-' + sortBy,
        populate: ['numLps', { path: 'latestLps', select: 'owner title coverImg' }],
        lean: false,
        offset,
        limit,
        customLabels
    }

    const users = await User.paginate({}, options)
    res.send(users)

})

/**
 * @description Get user detail: profile public data and owned lps
 * @route GET /users/{username}/
 * @access Authenticated.
 */
const getUserDetail = asyncHandler(async (req, res) => {
    const paramUser = await User.findOne({ username: req.params.username })
    if (paramUser) {
        const userLps = await Lp.find({ owner: paramUser.id, isPublic: true })
            .select('title artist coverImg').populate('artist', 'name -_id')
        const userDetail = paramUser.publicProfile()
        const followers = await Following.find({ followed: paramUser.id }).
            populate('follower', 'username picture -_id').select('follower -_id')
        userDetail.followers = followers.map((follower) => follower.follower)
        userDetail.ownedLps = userLps.map((lp) => {
            return {
                _id: lp._id,
                title: lp.title,
                artist: lp.artist.name,
                coverImg: lp.coverImg,
            }
        })
        res.send(userDetail)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

/**
 * @description Follow user
 * @route POST /users/{username}/follow
 * @access Authenticated as requested user
 */
const followUser = asyncHandler(async (req, res) => {
    const paramUser = await User.findOne({ username: req.params.username })
    if (paramUser) {
        if (req.user.id != paramUser.id) {
            const follower = req.user.id
            const followed = paramUser.id
            const following = await Following.findOne({ follower, followed })
            if (!following) {
                await new Following({ follower, followed }).save()
                res.send({
                    status: 'success',
                    msg: `You are following user ${paramUser.username}`
                })
            } else {
                res.status(405)
                throw new Error(`Already following user ${paramUser.username}`)
            }
        } else {
            res.status(405)
            throw new Error('A user can not follow himself')
        }
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

/**
 * @description Unfollow user
 * @route DELETE /users/{username}/follow
 * @access Authenticated as requested user
 */
const unfollowUser = asyncHandler(async (req, res) => {
    const paramUser = await User.findOne({ username: req.params.username })
    if (paramUser) {

        const follower = req.user.id
        const followed = paramUser.id
        const following = Following.findOne({ follower, followed })
        if (following) {
            await following.deleteOne()
            res.send({
                status: 'success',
                msg: `You have stopped following user ${paramUser.username}`
            })
        } else {
            res.status(405)
            throw new Error(`Not following user ${paramUser.username}`)
        }

    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export { getUsers, getUserDetail, followUser, unfollowUser }