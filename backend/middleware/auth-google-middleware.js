import jwt from 'jsonwebtoken'
import User from '../models/user-model.js'
import { Strategy } from 'passport-google-oauth20'

const opts = {
  clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback'
}

const GoogleStrategy = new Strategy(
  opts,
  async (accessToken, refreshToken, profile, cb) => {
    console.log(profile)

    User.findOne(
      {
        googleId: profile.id,
      },
      function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        } else {
          return done(err, user)
        }
      }
    )
  }
)

export { GoogleStrategy }
