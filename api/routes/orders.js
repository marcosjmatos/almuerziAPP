const express = require('express');
const orders = require('../models/orders')
const {isAuthenticated, hasRoles} = require('../auth');

const router = express.Router()

router.get("/api/orders", (req,res) => {
    orders.find()
    .exec()
    .then(x => res.status(200).send(x))
})
router.get("api/orders/:id", (req, res) => {
    orders.findById(req.params.id)
    .exec()
    .then(x => res.status(200).send(x))
})
router.post("/api/orders",isAuthenticated,(req,res) => {
    orders.create({...req.body}).then(x => res.sendStatus(201).send(x))
})
router.put("api/orders/:id", isAuthenticated,(req,res) =>{
    orders.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.sendStatus(204))
})
router.delete("api/orders/:id", isAuthenticated,(req,res) => {
    orders.findOneAndDelete(req.params.id)
    .exec()
    .then(() => res.sendStatus(204))
})
module.exports = router