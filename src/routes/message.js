const express = require("express");
const Message = require("../models/message");
const User = require("../models/user");
const randGen = require("../utils/randGen");
const router = express.Router();


// Send message
router.post('/send', (req, res) => {
    const data = req.body.data

    if (data) {
        if (data.name && data.phone && data.email && data.subject && data.message) {
            data.uuid = randGen(100)
            new Message(data).save(err => {
                if (err) res.json({ success: false })
                else res.json({ success: true })
            }
            )
        } else res.json({ success: false })
    }
})


// Get Messages
router.post('/messages', (req, res) => {

    User.findOne({ token: req.body.token }, (err, user) => {
        if (user) {
            if (user.login) {
                Message.find({}, (err, messages) => {
                    if (messages) {

                        const data = []

                        let noRead = 0

                        for (let message in messages) {
                            let x = {}

                            x.uuid = messages[message].uuid
                            x.name = messages[message].name
                            x.read = messages[message].read
                            x.createdDate = messages[message].createdDate

                            if (!messages[message].read) noRead += 1

                            data.push(x)

                            x = {}
                        }

                        res.json({ messages: data, noRead })

                    } else res.json({ success: false })
                })
            } else res.json({ success: false })
        } else res.json({ success: false })
    })

})


module.exports = router