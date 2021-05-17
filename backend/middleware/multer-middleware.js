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

const multerUploadMultipleImages = (fieldName, maxCount) => upload.array(fieldName, maxCount)

export { multerUploadSingleImage, multerUploadMultipleImages }