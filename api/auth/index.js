const jwt = require('jsonwebtoken')
const users = require('../models/users')



const isAuthenticated = (req,res,next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.sendStatus(403)
    }
    jwt.verify(token, "mi-secreto", (err, decoded) =>{
        const {_id} = decoded
        users.findOne({_id}).exec()
        .then(user => {
            req.user = user
            next()
        })
    })
}

const hasRoles = roles => (req, res, next) => {
    if (roles.indexOf(req,res,roles) > -1) {
        return next()
    }
    return res.sendStatus(403)
}

module.exports = {
    isAuthenticated,
    hasRoles,
}