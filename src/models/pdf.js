const mongoose = require("mongoose");


const pdf = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    product: {
        type: String,
        required: true,
        unique: true
    },
    categoriePdf: {
        type: String
    },
    featuresPdf: {
        type: String
    },

});


module.exports = mongoose.model("Pdf", pdf);