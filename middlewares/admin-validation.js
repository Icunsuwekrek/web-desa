const joi = require(`joi`)
const { request, response } = require("../routes/admin.route")

const validateAdmin = (request, response, next) =>{
    /**define rules for request */
    const rules = joi
    .object()
    .keys({
        nama: joi.string().required(),
        nomor_hp: joi.number().required(),
        alamat: joi.string().required(),
        username: joi.string().required(),
        password: joi.string().required()
    })
    .options({abortEarly: false})
    let { error } = rules.validate(request.body)

    /**if error is exists */
    if (error != null) {
        /**get all error message */
        let errMassage = error.details.map(it => it.message).joi

        /**return error message with code 422 */
        return response.status(422).json({
            success: false,
            massage: errMassage
        })
        
    }
    next()
}
module.exports = {validateAdmin}