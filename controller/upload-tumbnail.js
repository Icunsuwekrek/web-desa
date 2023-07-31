const multer = require(`multer`)
const { request } = require("../routes/berita.route")


const configStorage = multer.diskStorage({
    destination: (request, File, callback) => {
        callback(null, `./tumbnail`)
    },
    filename: (request, file, callback) => {
        callback(null, `image-${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage: configStorage,

    fileFilter: (request, file, callback) =>{
        const extension = [`image/jpg`, `image/png`, `image/jpeg`]

        if (!extension.includes(file.mimetype)) {
            callback(null, false)
            return callback(null, `File tidak valid`)
        }

        const maxSize=(1*1024*1024)
        const fileSize = request.headers[`content-length`]
        if (fileSize>maxSize) {
            callback(null, false)
            return callback(null, `Ukuran file terlalu besar`)
        }
        callback(null, true)
    }
})
module.exports = upload