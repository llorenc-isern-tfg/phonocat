import faker from 'faker'
import mongoose from 'mongoose'

import '../config/env-config.js'
import User from '../models/user-model.js'

const NUM_USERS = 1250

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

// createDBConnection()

//Aquest script serveix per generar usuaris de mentida per provar funcionalitats de l'aplicació
//Els passwords es guarden encriptats per tant cal apuntar-los al generar el llistat si es vol entrar amb aquests usuaris
const seedUsers = async () => {
    try {
        createDBConnection()

        // faker.seed(666) //activar per resultats consistents entre execucions

        for (let i = 0; i < NUM_USERS; i++) {

            const email = faker.internet.email()
            const password = faker.internet.password()
            console.log('CREDENCIALS: ', email, password)
            let user = new User({
                username: faker.internet.userName(),
                email,
                password,
                birthDate: faker.date.past(),
                phoneNumber: faker.phone.phoneNumber(),
                picture: faker.image.avatar(),
                country: faker.address.countryCode(),
                bio: faker.lorem.sentences()
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