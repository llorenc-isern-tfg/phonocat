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
export const uploadImageBufferCloud = async (buffer, folder, public_id) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            },
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    })
}

export const deleteImageCloud = async (path) => {
    cloudinary.uploader.destroy(path, function (error, result) {
        console.log(`Delete image cloudinary ${path}`, result, error)
    })
}

export const normalizeImageFormat = async (inputBuffer) => {
    return sharp(inputBuffer).resize(600, 600).png().toBuffer()
}

export const findExternalGenre = (genre) => {
    console.log('GENRE: ' + genre)
    switch (genre) {
        case 'Blues':
        case 'Classical':
        case 'Electronic':
        case 'Jazz':
        case 'Latin':
        case 'Pop':
        case 'Reggae':
        case 'Rock':
            return genre.toLowerCase()
        case 'Children\'s':
            return 'childrens'
        case 'Folk, World, & Country':
            return 'folk'
        case 'Funk / Soul':
        case 'Funk Soul':
            return 'funk_soul'
        case 'Hip - Hop':
        case 'Hip Hop':
            return 'hiphop'
        default:
            return 'other'
    }
}

//Utilitat per relacionar alguns països de fonts externes amb formats estranys
export const findReleaseCountry = (country) => {
    console.log('COUNTRY: ' + country)
    switch (country) {
        case 'UK':
        case 'UK & Europe':
        case 'UK & France':
        case 'UK & Ireland':
        case 'UK & US':
            return 'GB'
        case 'US':
        case 'USA & Canada':
        case 'USA & Europe':
        case 'USA, Canada & Europe':
        case 'USA, Canada & UK':
            return 'US'
        default:
            return ''
    }
}