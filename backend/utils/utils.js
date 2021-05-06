import fs from 'fs'
import axios from 'axios'
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

export const saveImgToDisk = async (imgUrl, localPath) => {

}