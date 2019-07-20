const mongoose = require("mongoose");


const user = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  photo: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  login: {
    default: true,
    type: Boolean,
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  }
});


module.exports = mongoose.model("User", user);