import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema({
    rating: {
        required: true,
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

const lpSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    label: {
        type: String
    },
    releaseYear: {
        type: Number
    },
    releaseCountry: {
        type: String
    },
    genre: {
        type: String,
        required: true,
        enum: ['blues', 'classical', 'electronic', 'folk', 'funk', 'soul', 'hiphop', 'jazz', 'latin', 'pop', 'reggae', 'rock', 'metal', 'childrens', 'other'],
    },
    condition: {
        type: String,
        enum: ['mint', 'nearmint', 'vgood', 'good', 'fair', 'poor']
    },
    mbid: {
        type: String
    },
    channel: {
        type: String,
        enum: ['mono', 'stereo'],
        default: 'stereo'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    coverImg: {
        type: String
    },
    numDiscs: {
        type: Number,
        default: 1
    },
    weight: {
        type: String,
        enum: ['lt180', '180', 'mt180']
    },
    review: {
        type: reviewSchema
    }

}, {
    timestamps: true
})

const Lp = mongoose.model('Lp', lpSchema)

export default Lp