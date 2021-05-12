import asyncHandler from 'express-async-handler'
import { Strategy } from 'passport-google-oauth20'
import User from '../models/user-model.js'

const opts = {
  clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/google/callback'
}

const GoogleStrategy = new Strategy(
  opts, asyncHandler(
    async (accessToken, refreshToken, profile, done) => {
      console.log('profile: ' + JSON.stringify(profile))

      let googleUser = await User.findOne({ googleId: profile.id })
      if (googleUser) {
        //l'usuari ja ha accedit amb google oauth
        done(null, googleUser);
      } else {
        //primer acces, creem un usuari i vinculem l'id de google
        //de moment farem servir el nom del perfil de google amb un timestamp com a nom de l'aplicació per evitar duplicats
        //Buscar una solució més elegant? potser deixar el nom com a no unic i fer servir l'id als endpoints d'usuari)

        googleUser = await new User({
          username: profile.name.givenName + '_' + process.hrtime(),
          googleId: profile.id,
          email: profile.emails[0].value
        }).save()
        done(null, googleUser)
      }
    }));

export { GoogleStrategy }
