const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const port = process.env.PORT || 3000


mongoose.connect("mongodb://localhost/air-conditioner", { useNewUrlParser: true, useCreateIndex: true })

mongoose.connection.on("open", () => console.log("Connected to mongodb"));
mongoose.connection.on("error", err => console.log(`Mongodb connection error: ${err}`));

app.use(bodyParser.json({ limit: '20mb' }))
app.use(cors())


app.use('/user', require('./src/routes/user'))
app.use('/product', require('./src/routes/product'))
app.use('/settings', require('./src/routes/settings'))
app.use('/mail', require('./src/routes/mail'))


app.get('*', (req, res) => res.json({ error_code: 404 }))
app.post('*', (req, res) => res.json({ error_code: 404 }))


app.listen(port, () => console.log(`App started on: ${port}`))