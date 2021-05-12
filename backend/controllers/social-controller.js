
import asyncHandler from 'express-async-handler'
import _ from 'lodash'

import User from '../models/user-model.js'


/**
 * @description Obtenir llistat d'usuaris
 * @route GET /users/{username}
 * @access Autenticat. Nomès es retornen les dades públiques dels usuaris
 */
const getUsers = asyncHandler(async (req, res) => {

    const page = parseInt(req.query.page) || 0
    const limit = parseInt(req.query.limit) || 10
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder || 1
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

    var options = {
        select: 'username bio picture country',
        sort: { sortBy: sortOrder },
        populate: ['numLps', { path: 'latestLps', select: 'owner title coverImg' }],
        lean: false,
        offset,
        limit,
    }

    const users = await User.paginate({}, options)

    res.send(users)

})

export { getUsers }