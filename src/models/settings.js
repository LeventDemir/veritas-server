const mongoose = require("mongoose");


const settings = new mongoose.Schema({
    email: { type: String },
    phone: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    address: { type: String },
});


module.exports = mongoose.model("Settings", settings);