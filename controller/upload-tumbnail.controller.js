const multer = require(`multer`)
const path = require(`path`)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./tumbnail`)
    },
    filename: (req, file, cb) => {
        cb(null, `tumbnail-${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage: storage,
    /**filter uploaded file */
    fileFilter: (req, file, cb) => {
        /**filter type of file */
        const acceptedType = [`image/jpg`, `image/jpeg`,
            `image/png`]
        if (!acceptedType.includes(file.mimetype)) {
            cb(null, false) /**refuse upload */
            return cb(`Invalid file type(${file.mimetype})`)
        }
        /**filter size of file */
        const fileSize = req.headers[`content-length`]
        const maxSize = (10 * 1024 *1024) /**max 10mb */
        if (fileSize>maxSize) {
            cb(null, false) /**refuse upload */
            return cb(`Ukuran file terlalu besar`)
        }
        cb(null, true)
    }
})
module.exports = upload