const express = require("express");
const fs = require('fs')
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
                        data.uuid = randGen(50)

                        fs.mkdirSync(`src/static/${data.uuid}`)

                        const imageData = data.photo.replace(/^data:image\/\w+;base64,/, "");

                        const imageName = `photo.${data.photo.split(";")[0].split("/")[1]}`

                        const buffer = new Buffer(imageData, 'base64');

                        fs.writeFileSync(`src/static/${data.uuid}/${imageName}`, buffer);

                        data.photo = `http://localhost:3000/static/${data.uuid}/${imageName}`

                        if (data.categoriePdf) {
                            const pdfData = data.categoriePdf.replace(/^data:application\/\w+;base64,/, "");
                            const buffer = new Buffer(pdfData, 'base64');
                            fs.writeFileSync(`src/static/${data.uuid}/categorie.pdf`, buffer, 'binary');

                            data.categoriePdf = `http://localhost:3000/static/${data.uuid}/categorie.pdf`
                        }

                        if (data.featuresPdf) {
                            const pdfData = data.featuresPdf.replace(/^data:application\/\w+;base64,/, "");
                            const buffer = new Buffer(pdfData, 'base64');
                            fs.writeFileSync(`src/static/${data.uuid}/features.pdf`, buffer, 'binary');
                            data.featuresPdf = `http://localhost:3000/static/${data.uuid}/categorie.pdf`
                        }

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
                            const uuid = product.uuid
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
            categorie: product.categorie,
            description: product.description,
            categoriePdf: product.categoriePdf || "",
            featuresPdf: product.featuresPdf || ""
        })
        else res.json({ el: false })
    })
})


module.exports = router