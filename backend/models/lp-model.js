import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

import trackSchema from './track-schema.js'

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
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Artist'
    },
    label: {
        type: String
    },
    year: {
        type: Number
    },
    country: {
        type: String
    },
    genre: {
        type: String,
        required: true,
        enum: ['blues', 'classical', 'electronic', 'folk', 'funk_soul', 'hiphop', 'jazz', 'latin', 'pop', 'reggae', 'rock', 'metal', 'childrens', 'other'],
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
        // default: true
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
    },
    trackList: [{
        type: trackSchema
    }],

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//Afegim un virtual amb els últims LPs amb visivilitat pública per poder fer populate al llistat d'usuaris
lpSchema.virtual('listedItem', {
    ref: 'ListedItem',
    localField: '_id',
    foreignField: 'lp',
    justOne: true
})

// lpSchema.virtual('numOffers', {
//     ref: 'Lp',
//     localField: '_id',
//     foreignField: 'owner',
//     count: true
// })

lpSchema.plugin(mongoosePaginate)

const Lp = mongoose.model('Lp', lpSchema)

export default Lp