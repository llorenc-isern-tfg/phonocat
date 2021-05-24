import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import reviewSchema from './reviewSchema.js'

const offerSchema = mongoose.Schema({
    listedItem: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ListedItem',
    },
    suggestedPrice: {
        type: Number,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    sellerReview: {
        type: reviewSchema
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    buyerReview: {
        type: reviewSchema
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'accepted', 'rejected']
    },
}, {
    timestamps: true
})

offerSchema.plugin(aggregatePaginate)

const Offer = mongoose.model('Offer', offerSchema)

//aggregate per agrupar ofertes per LP en venda
export const aggregatedReceivedOffers = userId => Offer.aggregate([
    { $match: { seller: userId } },
    { $lookup: { from: 'users', localField: 'buyer', foreignField: '_id', as: 'buyer' } },
    { $unwind: '$buyer' },
    { $lookup: { from: 'listeditems', localField: 'listedItem', foreignField: '_id', as: 'listedItem' } },
    { $unwind: '$listedItem' },
    { $lookup: { from: "lps", localField: "listedItem.lp", foreignField: "_id", as: "listedItem.lp" } },
    { $unwind: "$listedItem.lp" },
    { $lookup: { from: "artists", localField: "listedItem.lp.artist", foreignField: "_id", as: "listedItem.lp.artist" } },
    { $unwind: "$listedItem.lp.artist" },
    {
        $group: {
            _id: '$listedItem',
            count: { $sum: 1 },
            offers: { $push: { _id: '$_id', suggestedPrice: '$suggestedPrice', buyer: '$buyer', status: '$status', listedItemId: '$listedItem._id', sellerReview: '$sellerReview' } }
        }
    },
    { $sort: { '_id.createdAt': -1 } },
    {
        $project: {
            _id: {
                lp: {
                    coverImg: 1, title: 1, artist: 1
                },
                wantedPrice: 1,
                status: 1,
                _id: 1
            },
            offers: {
                _id: 1,
                suggestedPrice: 1,
                buyer: {
                    _id: 1,
                    username: 1,
                    picture: 1

                },
                status: 1,
                listedItemId: 1,
                sellerReview: 1
            },
        }
    },
    {
        $project: { _id: 0, offers: 1, listedItem: '$_id' }
    },
])

export default Offer