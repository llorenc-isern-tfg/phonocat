import multer from 'multer'
import path from 'path'
import Datauri from 'datauri'


const storage = multer.memoryStorage()

const upload = multer(
    {
        storage,
        limits: {
            fileSize: '10MB'
        },
        fileFilter(req, file, cb) {
            checkFileType(file, cb)
        }
    }
)

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Only images allowed')
    }
}

const multerUploadSingleImage = (fieldName) => upload.single(fieldName)

// const { DatauriParser } = new Datauri()

// console.log(DatauriParser)

// const parser = new DatauriParser()

// const imgDataUri = req => DatauriParser.format(path.extname(req.file.originalname).toString(), req.file.buffer);

// const dUri = new Datauri()

// try {
//     const dUri = new Datauri()
// } catch (error) {
//     console.log(error)
// }

const imgDataUri = req => {
    console.log(path.extname(req.file.originalname).toString())
    const imgDataUri = req.file.buffer.toString('base64')
    // dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer)
    return imgDataUri
}

export { multerUploadSingleImage, imgDataUri }