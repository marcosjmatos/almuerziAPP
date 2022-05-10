const mongoose = require('mongoose')
const Schema = mongoose.Schema


const users= mongoose.model("user", new Schema({
    email: String,
    password: String,
    salt: String,
    role: { type: String, default: 'user'},
}))
module.exports = users