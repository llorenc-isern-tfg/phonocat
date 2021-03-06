import faker from 'faker'
import mongoose from 'mongoose'

import '../config/env-config.js'
import User from '../models/user-model.js'

const DEFAULT_NUM_USERS = 500

const dbOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};

const createDBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, dbOptions)
    } catch (error) {
        console.log('MongoDb connection error: ', error)
        process.exit()
    }
}

const mongooseConn = mongoose.connection
mongooseConn.once('open', () => {
    console.log('MongoDb connection stablished')
})

mongooseConn.on('error', (error) => {
    console.log('MongoDb connection error: ', error)
    process.exit()
})

export const closeConnection = async () => {
    mongooseConn.close()
}

const locales = ['de', 'en_GB', 'en_US', 'es', 'fr', 'it', 'nl', 'pl', 'pt_PT']

const supportedLanguages = ['ca', 'es', 'en']
// createDBConnection()

//Aquest script serveix per generar usuaris de mentida per provar funcionalitats de l'aplicació
//Els passwords es guarden encriptats per tant cal apuntar-los al generar el llistat si es vol entrar amb aquests usuaris
const seedUsers = async () => {
    const params = process.argv.slice(2)

    try {
        createDBConnection()

        // faker.seed(666) //activar per resultats consistents entre execucions
        const numUsers = params[0] ? params[0] : DEFAULT_NUM_USERS

        for (let i = 0; i < numUsers; i++) {
            faker.setLocale(locales[Math.floor(Math.random() * locales.length)])
            const email = faker.internet.email()
            const password = faker.internet.password()
            var randomIndex = Math.floor(Math.random() * supportedLanguages.length)
            console.log('CREDENCIALS: ', email, password)
            let user = new User({
                username: faker.internet.userName(),
                email,
                password,
                birthDate: faker.date.past(),
                phoneNumber: faker.phone.phoneNumber(),
                picture: faker.image.avatar(),
                country: faker.address.countryCode(),
                bio: faker.lorem.sentences(),
                language: supportedLanguages[randomIndex]
            })

            try {
                await user.save()
            } catch (err) {
                console.log(err)
            }

        }
    } catch (err) {
        console.log(err)
    } finally {
        closeConnection()
    }
}

seedUsers()