// const jwt = require('jsonwebtoken')
// const md5 = require('md5')
// const { request, response } = require('../routes/admin.route')

// /**load model of user */
// const adminModel = require('../models/index').admin
// async function verifyToken(token) {
//     try {
//         let secretKey = 'Ciboox_Authorization_Secret_JWT_Auth'
//         let decode = jwt.verify(token, secretKey)
//         return true
//     } catch (error) {
//         return false
//     }
// }

// exports.authentication = async (request, response) => {
//     try {
//         let params = {
//             username: request.body.username,
//             password: md5(request.body.password)
//         }

//         /**check user exis */
//         let result = await adminModel.findOne(
//             {
//                 where: params
//             }
//         )

//         if (result) {
//             let secretKey = 'Ciboox_Authorization_Secret_JWT_Auth'

//             let header = {
//                 algorithm: "HS256"
//             }

//             let payload = JSON.stringify(result)

//             let token = jwt.sign(payload, secretKey, header)

//             /**give a response */
//             return response.json({
//                 logged: true,
//                 status: true,
//                 token: token,
//                 message: 'login berhasil',
//                 data: result
//             })

//         } else {
//             return response.json({
//                 status:false,
//                 message:'username atau password tidak cocok'
//             })

//         }
//     } catch(error){
//         return response.json({
//             status:false,
//             message:error.message
//         })
//     }
// }

// exports.authorization = (roles) =>{
//     return async function(request, response, next){
//         try {
//             let headers = request.headers.authorization

//             let token = headers?.split(" ")[1]

//             if(token == null){
//                 return response
//                 .status(401)
//                 .json({
//                     status:false,
//                     message:`Unauthorized`
//                 })
//             }
//             if (!await verifyToken(token)) {
//                 return response
//                 .status(401)
//                 .json({
//                     status:false,
//                     message:`INVALID TOKEN`
//                 })
//             }
//             let plainText = jwt.decode(token)

//             if (!roles.includes(plainText.role)) {
//                 return response
//                 .status(403)
//                 .json({
//                     status:false,
//                     message:`AKSES DITOLAK`
//                 })
//             }
//             next()

//         } catch (error) {
//             return response.json({
//                 status:false,
//                 message:error.message
//             })
//         }
//     }
// }