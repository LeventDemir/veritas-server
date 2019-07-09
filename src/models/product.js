const mongoose = require("mongoose");


const product = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    categorie: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categoriePdf: {
        type: String
    },
    featuresPdf: {
        type: String
    },
    createdDate: {
        type: Date,
        required: true,
        default: new Date()
    },
});


module.exports = mongoose.model("Product", product);