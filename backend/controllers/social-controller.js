
import asyncHandler from 'express-async-handler'
import _ from 'lodash'

import User from '../models/user-model.js'
import Lp from '../models/lp-model.js'


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

    console.log(options)
    console.log(users.users.length)
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
        userDetail.ownedLps = userLps
        res.send(userDetail)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export { getUsers, getUserDetail }