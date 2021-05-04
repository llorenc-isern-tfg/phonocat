import mongoose from 'mongoose'

const artistSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    mbid: {
        type: String
    }
})

const Artist = mongoose.model('Artist', artistSchema)

export default Artist