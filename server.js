const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

const port = process.env.PORT || 3000


mongoose.connect("mongodb://localhost/air-conditioner", { useNewUrlParser: true, useCreateIndex: true })

mongoose.connection.on("open", () => console.log("Connected to mongodb"));
mongoose.connection.on("error", err => console.log(`Mongodb connection error: ${err}`));

app.use(bodyParser.json())


app.use('/user', require('./src/routes/user'))


app.listen(port, () => console.log(`App started on: ${port}`))