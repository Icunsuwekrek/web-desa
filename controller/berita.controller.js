const { request, response } = require("express")
const res = require("express/lib/response")
const beritaModel = require(`../models/index`).berita
const {Op} = require("sequelize")
const path = require(`path`)
const fs = require(`fs`)
const { error } = require("console")

const upload = require (`./upload-tumbnail`)
const Joi = require("joi")

const validateBerita = (input) => {
    let rules = Joi.object().keys({
        isi_artikel: Joi.string().required(),
        judul: Joi.string().required()
    })
    let {error} = rules.validate(input)
    if (error) {
        let message = error
        .details
        .map(item => item.message)
        .join(`,`)
        
        return{
            status:false,
            message:message
        }
    }
    return {
        status:true
    }
}

exports.getAllBerita = async (request, response) => {
    let berita = await beritaModel.findAll()
    return response.json({
        succes: true,
        data: berita,
        message: `Berita berhasil ditampilkan`
    })
}
exports.findBerita = async (request, response) => {
    /**define keyword to find data */
    let keyword = request.body.keyword

    let news = await beritaModel.findAll({
        where: {
            [Op.or]: [
                { isi_artikel: { [Op.substring]: keyword } },
                { judul: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
        succes: true,
        data: news,
        message: `Berita berhasil ditampilkan`
    })
}
exports.addBerita = (request, response) => {
    /**run function upload */
    try {
        const uploadBerita = upload.single(`tumbnail`)
        uploadBerita(request, response, async error => {
            if (error) {
                return response.json({
                    status: false,
                    message: error
                })
            }

            if (!request.file) {
                return response.json({
                    status: false,
                    message: ` Tidak ada file yang di upload`
                })
            }

            let resultValidation = validateBerita(request.body)
            if (resultValidation.status == false) {
                return response.json({
                    status: false,
                    message: resultValidation.message
                })
            }
            request.body.gambar = request.file.filename

            await beritaModel.create(request.body)

            return response.json({
                status: true,
                message: `Data berita telah ditambahkan`
            })
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }

}

exports.updateBerita = async (request, response) => {
    upload(request, response, async error => {
        /**check if there are error when upload */
        if (error) {
            return response.json({ message: error })
        }
        let id = request.params.id
        let berita = {
            isi_artikel: request.body.isi_artikel,
            judul: request.body.judul
        }
        if (request.file) {
            const selectedBerita = await beritaModel.findOne({
                where: { id: id }
            })
            const oldTumbnail = selectedBerita.tumbnail
            const pathTumbnail = path.join(__dirname, `../tumbnail`, oldTumbnail)

            /**check file existance */
            if (fs.existsSync(pathTumbnail)) {
                fs.unlink(pathTumbnail, error =>
                    console.log(error))
            }
            berita.tumbnail = request.file.filename
        }
        /**execute update data based on defined id berita */
        beritaModel.update(berita, { where: { id: id } })
            .then(result => {
                return response.json({
                    succes: true,
                    message: `Data berita berhasil diupdate`
                })
            })
            .catch(error => {
                return response.json({
                    status: false,
                    message: error.message
                })
            })
    })
}
exports.deleteBerita = async (request, response) => {
    const id = request.params.id
    /**delete tumbnail file */
    /**get selected data berita */
    const berita = await beritaModel.findOne({ where: { id: id } })
    /**get old filename of tumbnail file */
    const oldTumbnail = berita.tumbnail
    /**prepare path of old cover to delete file */
    const pathTumbnail = path.join(__dirname, `../tumbnail`,
        oldTumbnail)
    /**check file existence */
    if (fs.existsSync(pathTumbnail)) {
        /**deleted old tumbnail file */
        fs.unlink(pathTumbnail, error => console.log(error))
    }
    beritaModel.destroy({ where: { id: id } })
        .then(result => {
            return response.json({
                succes: true,
                message: `Berita berhasil dihapus`
            })
        })
        .catch(error => {
            return response.json({
                succes: false,
                message: error.message
            })
        })
}