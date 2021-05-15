import bcrypt from "bcryptjs";

import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        immutable: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        immutable: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
        immutable: true
    },
    password: {
        type: String,
        minLength: 7
    },
    birthDate: {
        type: Date
    },
    phoneNumber: {
        type: String
    },
    picture: {
        type: String
    },
    language: {
        type: String,
        enum: ['ca', 'es', 'en'],
        default: 'ca'
    },
    country: {
        type: String
    },
    bio: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }, //Sense això toJSON() i toObject no inclourien els virtuals
    toObject: { virtuals: true }
})

//Afegim un virtual amb els últims LPs amb visivilitat pública per poder fer populate al llistat d'usuaris
userSchema.virtual('latestLps', {
    ref: 'Lp',
    localField: '_id',
    foreignField: 'owner',
    justOne: false,
    match: { isPublic: true },
    options: { sort: { createdAt: -1 }, limit: 5 }
})

//També fem un virtual amb el num total de LPs que té l'usuari
userSchema.virtual('numLps', {
    ref: 'Lp',
    localField: '_id',
    foreignField: 'owner',
    count: true
})

//Hash del password abans de desar
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        //Afegim salt per diferenciar el hash de dos passwords iguals
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

//treure el password de la resposta de l'usuari
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password

    return userObject
}

//mètode per retornar les dades públiques d'altres usuaris
userSchema.methods.publicProfile = function () {
    const userObject = this.toJSON()

    delete userObject.email
    delete userObject.birthDate
    delete userObject.address
    delete userObject.createdAt
    delete userObject.updatedAt
    delete userObject.__v

    return userObject
}


userSchema.methods.comparePassword = async function (receivedPassword) {
    return await bcrypt.compare(receivedPassword, this.password)
}

userSchema.plugin(mongoosePaginate)

const User = mongoose.model('User', userSchema)

export default User