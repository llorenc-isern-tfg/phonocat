import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import Lp from '../models/lp-model.js'
import User from '../models/user-model.js';

/**
 * @description Add LP to user collection
 * @route POST /users/{username}/lps/
 * @access Public
 */
const addLP = asyncHandler(async (req, res) => {
    console.log(req)

    const lp = new Lp({
        ...req.body,
        owner: req.user._id
    })

    await lp.save()
    res.status(201).send(lp)
});

/**
 * @description Get LP list from user collection
 * @route GET /users/{username}/lps
 * @access Authenticated. If not logged in as requested user, only public LPs are returned
 */
const getLPs = asyncHandler(async (req, res) => {
    const paramUser = await User.findOne({ username: req.params.username })
    if (paramUser) {
        let lps = await Lp.find({ owner: paramUser.id })
        if (req.user.id !== paramUser.id) {
            lps = lps.filter((lp) => {
                lp.isPublic
            })
        }
        let lpsSummary = []
        lps.forEach(lp => {
            lpsSummary.push({
                _id: lp._id,
                title: lp.title,
                genre: lp.genre,
                cover: lp.images.find((img) => {
                    img.isCover
                })
            })
        });
        res.send(lpsSummary)
    } else {
        res.status(404)
        throw new Error('Resource not found')
    }
})

/**
 * @description Get specific LP from user
 * @route GET /users/{username}/lps{id}
 * @access Authenticated. Logged in as LP owner if LP is not public
 */
const getLP = asyncHandler(async (req, res) => {
    const lp = await Lp.findById(req.params.id)
    if (lp) {
        await lp.populate('owner').execPopulate()
        if (req.user.id !== lp.owner.id && !lp.isPublic) {
            res.status(403)
            throw new Error('Permission denied')
        }
        res.send(lp)
    } else {
        res.status(404)
        throw new Error('LP not found')
    }
})

/**
 * @description Edit LP
 * @route PATCH /users/{username}/lps{id}
 * @access Authenticated as LP owner
 */
const editLP = asyncHandler(async (req, res) => {
    const lp = await Lp.findById(req.params.id)
    if (lp) {
        await lp.populate('owner').execPopulate()
        if (req.user.id !== lp.owner.id) {
            res.status(403)
            throw new Error('Permission denied')
        }
        const updates = Object.keys(req.body)
        updates.forEach((update) => lp[update] = req.body[update])
        await lp.save(req.body)
        res.send(lp)
    } else {
        res.status(404)
        throw new Error('LP not found')
    }
})

/**
 * @description Delete LP
 * @route DELETE /users/{username}/lps{id}
 * @access Authenticated as LP owner
 */
const deleteLP = asyncHandler(async (req, res) => {
    const lp = await Lp.findById(req.params.id)
    if (lp) {
        await lp.populate('owner').execPopulate()
        if (req.user.id !== lp.owner.id) {
            res.status(403)
            throw new Error('Permission denied')
        }
        await lp.delete()
        res.send({ message: 'LP removed' })
    } else {
        res.status(404)
        throw new Error('LP not found')
    }
})



export { addLP, getLPs, getLP, editLP, deleteLP }