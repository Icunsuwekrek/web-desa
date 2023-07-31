const express = require(`express`)
const md5 = require(`md5`)
const jwt = require(`jsonwebtoken`)
const adminModel = require(`../models/index`).admin

const authenticate = async (request, response) => {
    let dataLogin = {
        username: request.body.username,
        password: md5(request.body.password)
    }

    let dataAdmin = await adminModel.findOne({
        where: dataLogin
    })

    if (dataAdmin) {
        let payload = JSON.stringify(dataAdmin)

        let secret = `Ciboox_Authorization_Secret_JWT_Auth`
        let token = jwt.sign(payload, secret)

        return response.json({
            success: true,
            logged: true,
            message: `Authentikasi berhasil`,
            token: token,
            data: dataAdmin
        })
    }
    return response.json({
        success: false,
        logged: false,
        message:`Authentikasi gagal. Username atau Password salah`
    })
}

const authorize = (request, response, next) =>{
    let headers = request.headers.authorization

    let tokenKey = headers && headers.split(" ")[1]

    if (tokenKey == null) {
        return response.json({
            success:false,
            message:`User tidak sah`
        })
    }

    let secret= `Ciboox_Authorization_Secret_JWT_Auth`

    jwt.verify(tokenKey, secret,(error,user) => {
        if (error) {
            return response.json({
                success:false,
                message:` Token tidak valid`
            })
        }
    })
    next()
}
 module.exports = {authenticate, authorize}
