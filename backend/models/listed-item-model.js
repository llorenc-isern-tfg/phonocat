import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const MAX_PICTURES = 4

const listedItemSchema = mongoose.Schema({
    lp: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Lp',
        unique: true
    },
    wantedPrice: {
        type: Number,
        required: true
    },
    pictures: [
        {
            type: String
        }
    ],
    status: {
        type: String,
        default: 'available',
        enum: ['available', 'reserved', 'sold', 'withdrawn']
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//fem un virtual amb el num d'ofertes pendents
listedItemSchema.virtual('numPendingOffers', {
    ref: 'Offer',
    localField: '_id',
    foreignField: 'listedItem',
    match: { status: 'pending' },
    count: true
})

listedItemSchema.pre('validate', function (next) {
    if (this.pictures.length > MAX_PICTURES) throw (`Pictures exceed the maximum array size (${MAX_PICTURES})`);
    next()
});

listedItemSchema.plugin(aggregatePaginate)

const ListedItem = mongoose.model('ListedItem', listedItemSchema)


//aggregate per poder paginar amb filtres i ordre amb camps de subdocuments
export const aggregatedListedItems = (sort = {}, filter = {}) => ListedItem.aggregate([
    { $lookup: { from: "lps", localField: "lp", foreignField: "_id", as: "lp" } },
    { $unwind: "$lp" },
    { $lookup: { from: "artists", localField: "lp.artist", foreignField: "_id", as: "lp.artist" } },
    { $unwind: "$lp.artist" },
    { $lookup: { from: "users", localField: "lp.owner", foreignField: "_id", as: "lp.owner" } },
    { $unwind: "$lp.owner" },
    { $lookup: { from: "offers", localField: "_id", foreignField: "listedItem", as: "offers" } },
    { $sort: { ...sort } },
    { $match: { ...filter } },
    { $match: { status: 'available' } },
    {
        $project: {
            _id: 1,
            wantedPrice: 1,
            pictures: 1,
            createdAt: 1,
            lp: {
                coverImg: 1, title: 1, artist: 1, genre: 1,
                condition: 1, weight: 1, channel: 1, numDiscs: 1,
                owner: {
                    username: 1, country: 1, picture: 1
                }
            },
            offers: {
                status: 1,
                buyer: 1,
                suggestedPrice: 1
            },
            status: 1
        }
    }
])

export default ListedItem