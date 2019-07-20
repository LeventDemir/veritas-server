const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const port = process.env.PORT || 3000


// cloud db:  mongodb+srv://veritas:veritas-0220@cluster0-sgvg3.mongodb.net/test?retryWrites=true&w=majority
// local db:  mongodb://localhost/air-conditioner

mongoose.connect("mongodb+srv://veritas:veritas-0220@cluster0-sgvg3.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useCreateIndex: true }
)

mongoose.connection.on("open", () => console.log("Connected to mongodb"));
mongoose.connection.on("error", err => console.log(`Mongodb connection error: ${err}`));

app.use(bodyParser.json({ limit: '30mb' }))
app.use('/static', express.static(__dirname + '/src/static'))
app.use(cors())


app.use('/user', require('./src/routes/user'))
app.use('/product', require('./src/routes/product'))
app.use('/message', require('./src/routes/message'))


app.get('*', (req, res) => res.json({ error_code: 404 }))
app.post('*', (req, res) => res.json({ error_code: 404 }))


app.listen(port, () => console.log(`App started on: ${port}`))