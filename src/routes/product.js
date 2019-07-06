const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const randGen = require("../utils/randGen");
const router = express.Router();


// Create product
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


// Update product
router.post('/updateProduct', (req, res) => {
    const data = req.body.data

    if (data) {
        if (data.token && data.product && data.photo && data.name && data.categorie && data.description) {
            User.findOne({ token: data.token }, (err, user) => {
                if (user) {
                    if (user.login) {
                        Product.findOne({ uuid: data.product }, (err, product) => {
                            if (product) {
                                product.photo = data.photo
                                product.name = data.name
                                product.categorie = data.categorie
                                product.description = data.description

                                product.save(res.json({ msg: 'updated' }))
                            } else res.json({ el: false })
                        })
                    } else res.json({ el: false })
                } else res.json({ el: false })
            })
        } else res.json({ el: false })
    } else res.json({ el: false })
})


// Remove product
router.post('/removeProduct', (req, res) => {
    const data = req.body.data

    if (data) {
        if (data.token && data.product) {
            User.findOne({ token: data.token }, (err, user) => {
                if (user) {
                    if (user.login) {
                        Product.findOne({ uuid: data.product }, (err, product) => {
                            if (product) product.remove(res.json({ msg: 'removed' }))
                            else res.json({ el: false })
                        })
                    } else res.json({ el: false })
                } else res.json({ el: false })
            })
        } else res.json({ el: false })
    } else res.json({ el: false })
})


// Get products
router.get('/getProducts', (req, res) => {
    Product.find({}, (err, products) => {
        const data = []

        for (let product in products) {
            let x = {}

            x.uuid = products[product].uuid
            x.photo = products[product].photo
            x.name = products[product].name
            x.categorie = products[product].categorie

            data.push(x)

            x = {}
        }

        res.json(data)
    })
})


// Get products by categorie
router.get('/getProductsByCategorie', (req, res) => {
    Product.find({ categorie: req.query.categorie }, (err, products) => {
        const data = []

        for (let product in products) {
            let x = {}

            x.uuid = products[product].uuid
            x.photo = products[product].photo
            x.name = products[product].name

            data.push(x)

            x = {}
        }

        res.json(data)
    })
})


// Get product
router.get('/getProduct', (req, res) => {
    Product.findOne({ uuid: req.query.product }, (err, product) => {
        if (product) res.json({
            photo: product.photo,
            name: product.name,
            description: product.description,
        })
        else res.json({ el: false })
    })
})


module.exports = router