import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        required: true,
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
        type: String,
        required: true
    },
    releaseYear: {
        type: Number
    },
    genre: {
        type: String,
        required: true,
        enum: ['blues', 'brass&military', 'childrens', 'classical', 'electronic', 'folk', 'funk', 'soul', 'hiphop', 'jazz', 'latin', 'pop', 'reggae', 'rock', 'metal', 'other'],
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
        enum: ['Mono', 'Stereo'],
        default: 'Stereo'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    images: [
        {
            uri: {
                type: String,
                required: true
            },
            isCover: {
                type: Boolean,
                default: false
            }
        }
    ],
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