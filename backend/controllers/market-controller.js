import axios from 'axios'
import asyncHandler from 'express-async-handler'

import Lp from '../models/lp-model.js'
import ListedItem from '../models/listed-item-model.js'
import {
    normalizeImageFormat, uploadImageBufferCloud,
} from '../utils/utils.js'

const publishListedItem = asyncHandler(async (req, res) => {
    //només pot pujar la portada el propietari del lp
    const lp = await Lp.findById(req.params.id)
    if (lp) {
        await lp.populate('owner').execPopulate()
        if (req.user.id !== lp.owner.id) {
            res.status(403)
            throw new Error('Permission denied')
        }

        let listedItem = await ListedItem.findOne({ lp: lp._id })
        console.log(listedItem)
        if (listedItem) {
            res.status(405)
            throw new Error(`Lp is already listed for sale`)
        }

        const wantedPrice = req.body.wantedPrice
        if (!wantedPrice) {
            res.status(400)
            throw new Error('Wanted price required')
        }

        listedItem = new ListedItem({
            lp: lp._id,
            wantedPrice,
            pictures: []
        })

        await Promise.all(req.files.map(async (file, i) => {
            //es pre-processa la imatge amb la llibreria sharp per mantenir un format comú a les caràtules
            const processedImageBuffer = await normalizeImageFormat(file.buffer)
            //S'envia la imatge al cloud de cloudinary i s'emmagatzema la url resultant a bdd
            const cloudinaryResponse = await uploadImageBufferCloud(processedImageBuffer, 'phonocat/listedItems', `${listedItem._id}_${i}`)
            listedItem.pictures.push(cloudinaryResponse.secure_url)
        }))

        await listedItem.save()

        res.send({
            message: 'success',
            listedItem
        })

    } else {
        res.status(404)
        throw new Error('LP not found')
    }

})

export { publishListedItem }