import mongoose from 'mongoose'

const followingSchema = mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    followed: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

}, {
    timestamps: true
})

const Following = mongoose.model('Following', followingSchema)

export default Following