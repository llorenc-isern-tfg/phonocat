import jwt from 'jsonwebtoken'

/**
 * Creates a JWT token based on user id
 * @param {*} id user Id
 * @returns JWT token
 */
export const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
    })
}