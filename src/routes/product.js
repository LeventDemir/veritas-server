const express = require("express");
const fs = require('fs')
const User = require("../models/user");
const Product = require("../models/product");
const randGen = require("../utils/randGen");
const router = express.Router();


// Create product
router.post('/create', (req, res) => {
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

                        data.photo = `http://127.0.0.1:3000/static/${data.uuid}/photo/${imageName}`

                        if (data.categoriePdf) {
                            const pdfData = data.categoriePdf.replace(/^data:application\/\w+;base64,/, "");
                            const buffer = new Buffer(pdfData, 'base64');
                            fs.writeFileSync(`src/static/${data.uuid}/categorie.pdf`, buffer);

                            data.categoriePdf = `http://127.0.0.1:3000/static/${data.uuid}/categorie.pdf`
                        }

                        if (data.featuresPdf) {
                            const pdfData = data.featuresPdf.replace(/^data:application\/\w+;base64,/, "");
                            const buffer = new Buffer(pdfData, 'base64');
                            fs.writeFileSync(`src/static/${data.uuid}/features.pdf`, buffer);
                            data.featuresPdf = `http://127.0.0.1:3000/static/${data.uuid}/features.pdf`
                        }

                        new Product(data).save(err => {
                            if (err) res.json({ success: false })
                            else res.json({ success: true })
                        })
                    } else res.json({ success: false })
                } else res.json({ success: false })
            })
        } else res.json({ success: false })
    } else res.json({ success: false })
})


// Update product
router.post('/update', (req, res) => {
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

                                    product.photo = `http://127.0.0.1:3000/static/${product.uuid}/photo/${imageName}`
                                }

                                if (data.categoriePdf) {
                                    if (data.categoriePdf !== product.categoriePdf) {
                                        const pdfData = data.categoriePdf.replace(/^data:application\/\w+;base64,/, "");
                                        const buffer = new Buffer(pdfData, 'base64');
                                        fs.writeFileSync(`src/static/${product.uuid}/categorie.pdf`, buffer);

                                        product.categoriePdf = `http://127.0.0.1:3000/static/${product.uuid}/categorie.pdf`
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

                                        product.featuresPdf = `http://127.0.0.1:3000/static/${product.uuid}/features.pdf`
                                    }
                                } else {
                                    const featuresPdf = fs.readdirSync(`src/static/${product.uuid}/`)

                                    if (featuresPdf.includes('features.pdf'))
                                        fs.unlinkSync(`src/static/${product.uuid}/features.pdf`)

                                    product.featuresPdf = ""
                                }

                                product.save(res.json({ success: true }))
                            } else res.json({ success: false })
                        })
                    } else res.json({ success: false })
                } else res.json({ success: false })
            })
        } else res.json({ success: false })
    } else res.json({ success: false })
})


// Remove product
router.post('/remove', (req, res) => {
    const data = req.body.data

    if (data) {
        if (data.token && data.product) {
            User.findOne({ token: data.token }, (err, user) => {
                if (user) {
                    if (user.login) {
                        Product.findOne({ uuid: data.product }, (err, product) => {
                            if (product) {
                                const photo = fs.readdirSync(`src/static/${product.uuid}/photo/`)
                                const pdfs = fs.readdirSync(`src/static/${product.uuid}/`)

                                if (photo.length > 0)
                                    fs.unlinkSync(`src/static/${product.uuid}/photo/${photo[0]}`)

                                if (fs.existsSync(`src/static/${product.uuid}/photo`))
                                    fs.rmdirSync(`src/static/${product.uuid}/photo`)

                                if (pdfs.includes('categorie.pdf'))
                                    fs.unlinkSync(`src/static/${product.uuid}/categorie.pdf`)

                                if (pdfs.includes('features.pdf'))
                                    fs.unlinkSync(`src/static/${product.uuid}/features.pdf`)

                                if (fs.existsSync(`src/static/${product.uuid}`))
                                    fs.rmdirSync(`src/static/${product.uuid}`)

                                product.remove(err => {
                                    if (err) res.json({ success: false })
                                    else res.json({ success: true })
                                })
                            }
                            else res.json({ success: false })
                        })
                    } else res.json({ success: false })
                } else res.json({ success: false })
            })
        } else res.json({ success: false })
    } else res.json({ success: false })
})


// Get products
router.get('/products', (req, res) => {
    Product.find({}, (err, products) => {
        if (products) {
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
        } else res.json([])
    })
})


// Get products by categorie
router.get('/categorie', (req, res) => {
    Product.find({ categorie: req.query.categorie }, (err, products) => {
        if (products) {
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
        } else res.json([])
    })
})


// Get product
router.get('/product', (req, res) => {
    Product.findOne({ uuid: req.query.product }, (err, product) => {
        if (product) res.json({
            photo: product.photo,
            name: product.name,
            categorie: product.categorie,
            description: product.description,
            categoriePdf: product.categoriePdf,
            featuresPdf: product.featuresPdf
        })
        else res.json({ success: false })
    })
})


module.exports = router