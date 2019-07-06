const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const Pdf = require("../models/pdf");
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

                        const pdf = {
                            uuid: randGen(100),
                            product: data.uuid,
                            categoriePdf: data.categoriePdf,
                            featuresPdf: data.featuresPdf
                        }

                        data.categoriePdf = data.categoriePdf ? true : false
                        data.featuresPdf = data.featuresPdf ? true : false

                        new Product(data).save(() => new Pdf(pdf).save(res.json({ msg: 'created' })))
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
                                product.categoriePdf = data.categoriePdf ? true : false
                                product.featuresPdf = data.featuresPdf ? true : false

                                Pdf.findOne({ product: product.uuid }, (err, pdf) => {
                                    if (pdf) {
                                        pdf.categoriePdf = data.categoriePdf
                                        pdf.featuresPdf = data.featuresPdf

                                        pdf.save(product.save(res.json({ msg: 'updated' })))
                                    } else product.save(res.json({ msg: 'updated' }))
                                })
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
                            const uuid = product.uuid
                            if (product) product.remove(() => {
                                Pdf.findOne({ product: uuid }, (err, pdf) => {
                                    if (pdf) pdf.remove(res.json({ msg: 'removed' }))
                                    else res.json({ msg: 'removed' })
                                })
                            })
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
            categorie: product.categorie,
            description: product.description,
            categoriePdf: product.categoriePdf || "",
            featuresPdf: product.featuresPdf || ""
        })
        else res.json({ el: false })
    })
})


module.exports = router