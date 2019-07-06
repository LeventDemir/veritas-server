const mongoose = require("mongoose");


const settings = new mongoose.Schema({
    email: { type: String, required: true },
    phone: { type: String, required: true },
    instagram: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    address: { type: String, required: true },
});


module.exports = mongoose.model("Settings", settings);