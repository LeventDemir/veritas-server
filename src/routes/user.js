const express = require('express')

const router = express.Router()


router.post('/createUser', (req, res) => {

    const data = req.body

    res.send(data)

})


module.exports = router