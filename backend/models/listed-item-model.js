import mongoose from 'mongoose'

const MAX_PICTURES = 4

const listedItemSchema = mongoose.Schema({
    lp: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Lp'
    },
    wantedPrice: {
        type: Number,
        required: true
    },
    pictures: [
        {
            type: String
        }
    ]
})

listedItemSchema.pre('validate', function (next) {
    if (this.pictures.length > MAX_PICTURES) throw (`Pictures exceed the maximum array size (${MAX_PICTURES})`);
    next()
});