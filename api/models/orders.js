const mongoose = require('mongoose')
const Schema= mongoose.Schema


const orders= mongoose.model("orders", new Schema({
    meal_id: { type: Schema.Types.ObjectId, ref: "meal"},
    user_id: String,
}))
module.exports = orders
