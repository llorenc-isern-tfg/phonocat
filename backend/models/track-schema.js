import mongoose from 'mongoose'

const trackSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    position: {
        type: String
    },
    duration: {
        type: String
    },

})

export default trackSchema