const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const meals = require("./routes/meals")
const orders = require("./routes/orders")
const auth = require("./routes/auth")


app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URI)

app.use("/", meals )
app.use("/", orders )
app.use("/", auth )


module.exports = app