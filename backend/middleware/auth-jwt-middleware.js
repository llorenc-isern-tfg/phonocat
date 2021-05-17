import jwt from 'jsonwebtoken'
import User from '../models/user-model.js'
import { Strategy, ExtractJwt } from 'passport-jwt'

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

const JwtStrategy = new Strategy(opts, async (payload, done) => {
    try {
        console.log('user middleware')
        const user = await User.findById(payload.id)
        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (e) {
        return done(e, false)
    }
})


export { JwtStrategy }