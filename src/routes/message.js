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
            const now = new Date()
            const date = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear()
            const time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()

            data.uuid = randGen(100)
            data.createdDate = date + " - " + time

            new Message(data).save(err => {
                if (err) res.json({ success: false })
                else res.json({ success: true })
            }
            )
        } else res.json({ success: false })
    }
})


// Get messages
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

                            data.unshift(x)

                            x = {}
                        }

                        res.json({ messages: data, noRead })

                    } else res.json({ success: false })
                })
            } else res.json({ success: false })
        } else res.json({ success: false })
    })

})


// Get message
router.post('/message', (req, res) => {
    const data = req.body.data

    if (data) {
        if (data.token, data.message) {
            User.findOne({ token: data.token }, (err, user) => {
                if (user) {
                    if (user.login) {
                        Message.findOne({ uuid: data.message }, (err, message) => {
                            if (message) {
                                res.json({
                                    name: message.name,
                                    email: message.email,
                                    phone: message.phone,
                                    subject: message.subject,
                                    message: message.message,
                                    read: message.read,
                                    createdDate: message.createdDate,
                                })
                            } else res.json({ success: false })
                        })
                    } else res.json({ success: false })
                } else res.json({ success: false })
            })
        } else res.json({ success: false })
    } else res.json({ success: false })
})


// Read message
router.post('/read', (req, res) => {
    const data = req.body.data

    if (data) {
        if (data.token, data.message) {
            User.findOne({ token: data.token }, (err, user) => {
                if (user) {
                    if (user.login) {
                        Message.findOne({ uuid: data.message }, (err, message) => {
                            if (message) {
                                message.read = true
                                message.save(err => {
                                    if (err) res.json({ success: false })
                                    else res.json({ success: true })
                                })
                            } else res.json({ success: false })
                        })
                    } else res.json({ success: false })
                } else res.json({ success: false })
            })
        } else res.json({ success: false })
    } else res.json({ success: false })
})


// Remove message
router.post('/remove', (req, res) => {
    const data = req.body.data

    if (data) {
        if (data.token, data.message) {
            User.findOne({ token: data.token }, (err, user) => {
                if (user) {
                    if (user.login) {
                        Message.findOne({ uuid: data.message }, (err, message) => {
                            if (message) {
                                message.remove(err => {
                                    if (err) res.json({ success: false })
                                    else res.json({ success: true })
                                })
                            } else res.json({ success: false })
                        })
                    } else res.json({ success: false })
                } else res.json({ success: false })
            })
        } else res.json({ success: false })
    } else res.json({ success: false })
})


module.exports = router