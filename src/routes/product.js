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
                        fs.mkdirSync(`src/static/${data.uuid}/photo`)

                        const imageData = data.photo.replace(/^data:image\/\w+;base64,/, "");

                        const imageName = `photo.${data.photo.split(";")[0].split("/")[1]}`

                        const buffer = new Buffer(imageData, 'base64');

                        fs.writeFileSync(`src/static/${data.uuid}/photo/${imageName}`, buffer);

                        data.photo = `http://18.188.8.112:3000/static/${data.uuid}/photo/${imageName}`

                        if (data.categoriePdf) {
                            const pdfData = data.categoriePdf.replace(/^data:application\/\w+;base64,/, "");
                            const buffer = new Buffer(pdfData, 'base64');
                            fs.writeFileSync(`src/static/${data.uuid}/categorie.pdf`, buffer);

                            data.categoriePdf = `http://18.188.8.112:3000/static/${data.uuid}/categorie.pdf`
                        }

                        if (data.featuresPdf) {
                            const pdfData = data.featuresPdf.replace(/^data:application\/\w+;base64,/, "");
                            const buffer = new Buffer(pdfData, 'base64');
                            fs.writeFileSync(`src/static/${data.uuid}/features.pdf`, buffer);
                            data.featuresPdf = `http://18.188.8.112:3000/static/${data.uuid}/features.pdf`
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
                                product.name = data.name
                                product.categorie = data.categorie
                                product.description = data.description

                                if (data.photo !== product.photo) {
                                    const photo = fs.readdirSync(`src/static/${product.uuid}/photo/`)

                                    if (photo.length > 0)
                                        fs.unlinkSync(`src/static/${product.uuid}/photo/${photo[0]}`)

                                    const imageData = data.photo.replace(/^data:image\/\w+;base64,/, "");

                                    const imageName = `photo.${data.photo.split(";")[0].split("/")[1]}`

                                    const buffer = new Buffer(imageData, 'base64');

                                    fs.writeFileSync(`src/static/${product.uuid}/photo/${imageName}`, buffer);

                                    product.photo = `http://18.188.8.112:3000/static/${product.uuid}/photo/${imageName}`
                                }

                                if (data.categoriePdf) {
                                    if (data.categoriePdf !== product.categoriePdf) {
                                        const pdfData = data.categoriePdf.replace(/^data:application\/\w+;base64,/, "");
                                        const buffer = new Buffer(pdfData, 'base64');
                                        fs.writeFileSync(`src/static/${product.uuid}/categorie.pdf`, buffer);

                                        product.categoriePdf = `http://18.188.8.112:3000/static/${product.uuid}/categorie.pdf`
                                    }
                                } else {
                                    const categoriePdf = fs.readdirSync(`src/static/${product.uuid}/`)

                                    if (categoriePdf.includes('categorie.pdf'))
                                        fs.unlinkSync(`src/static/${product.uuid}/categorie.pdf`)

                                    product.categoriePdf = ""
                                }

                                if (data.featuresPdf) {
                                    if (data.featuresPdf !== product.featuresPdf) {
                                        const pdfData = data.featuresPdf.replace(/^data:application\/\w+;base64,/, "");
                                        const buffer = new Buffer(pdfData, 'base64');
                                        fs.writeFileSync(`src/static/${product.uuid}/features.pdf`, buffer);

                                        product.featuresPdf = `http://18.188.8.112:3000/static/${product.uuid}/features.pdf`
                                    }
                                } else {
                                    const featuresPdf = fs.readdirSync(`src/static/${product.uuid}/`)

                                    if (featuresPdf.includes('features.pdf'))
                                        fs.unlinkSync(`src/static/${product.uuid}/features.pdf`)

                                    product.featuresPdf = ""
                                }

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
                            if (product) {
                                const photo = fs.readdirSync(`src/static/${product.uuid}/photo/`)
                                const pdfs = fs.readdirSync(`src/static/${product.uuid}/`)

                                if (photo.length > 0)
                                    fs.unlinkSync(`src/static/${product.uuid}/photo/${photo[0]}`)

                                fs.rmdirSync(`src/static/${product.uuid}/photo`)


                                if (pdfs.includes('categorie.pdf'))
                                    fs.unlinkSync(`src/static/${product.uuid}/categorie.pdf`)

                                if (pdfs.includes('features.pdf'))
                                    fs.unlinkSync(`src/static/${product.uuid}/features.pdf`)

                                fs.rmdirSync(`src/static/${product.uuid}`)

                                product.remove(res.json({ msg: 'removed' }))
                            }
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

            data.unshift(x)

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

            data.unshift(x)

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
            categoriePdf: product.categoriePdf,
            featuresPdf: product.featuresPdf
        })
        else res.json({ el: false })
    })
})


module.exports = router