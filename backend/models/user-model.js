import bcrypt from "bcryptjs";

import mongoose from 'mongoose'

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
    timestamps: true
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

const User = mongoose.model('User', userSchema)

export default User