const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const randGen = require("../utils/randGen");
const router = express.Router();


router.post('/createProduct', (req, res) => {
    const data = req.body.data

    if (data) {
        if (data.token && data.photo && data.name && data.categorie && data.description) {
            User.findOne({ token: data.token }, (err, user) => {
                if (user) {
                    if (user.login) {
                        data.uuid = randGen(100)

                        new Product(data).save(res.json({ msg: 'created' }))
                    } else res.json({ el: false })
                } else res.json({ el: false })
            })
        } else res.json({ el: false })
    } else res.json({ el: false })
})


module.exports = router