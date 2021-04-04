import './config/env-config.js'
import express from 'express'
import passport from 'passport'
import morgan from 'morgan'
import createDBConnection from './config/db-config.js'
import userRoutes from './routes/user-routes.js'
import lpRoutes from './routes/lp-routes.js'
import { errorHandler, notFoundHandler } from './middleware/error-middleware.js'
import { JwtStrategy } from './middleware/auth-jwt-middleware.js'
import { GoogleStrategy } from './middleware/auth-google-middleware.js'

createDBConnection()

const app = express()
const PORT = process.env.PORT || 5000

if (process.env.EXEC_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use(passport.initialize())
passport.use(JwtStrategy)
passport.use(GoogleStrategy)

app.use(userRoutes)
app.use(lpRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(
  PORT,
  console.log(
    `Server is up in ${process.env.EXEC_ENV} environment on port ${PORT}`
  )
)
