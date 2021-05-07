import jwt from 'jsonwebtoken'
import streamifier from 'streamifier';
import sharp from 'sharp'

import cloudinary from '../config/cloudinary-config.js'

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

//puja una imatge en buffer a cloudinary (evita problemes amb escriptura de fitxers a heroku)
/**
 * Uploads an image to Cloudinary media storage service
 * @param {*} buffer file buffer
 * @param {*} folder destination folder
 * @param {*} public_id resource public_id
 * @returns Promise with service result
 */
export const uploadImage = async (buffer, folder, public_id) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id,
                folder,
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            },
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}

export const normalizeImageFormat = async (inputBuffer) => {
    return sharp(inputBuffer).resize(600, 600).png().toBuffer()
}