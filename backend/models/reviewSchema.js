import mongoose from 'mongoose'
const reviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    comment: {
        type: String
    }

}, {
    timestamps: true
})

export default reviewSchema