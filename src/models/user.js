const mongoose = require("mongoose");

const user = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  photo: {
    default: "https://musichubs.herokuapp.com/public/base?image=avatar",
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
  createdDate: {
    type: Date,
    required: true,
    default: new Date()
  },
  login: {
    default: true,
    type: Boolean,
    required: true
  },
  lastLogin: {
    type: String,
    required: true,
    default: new Date().getTime()
  },
  token: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("User", user);
