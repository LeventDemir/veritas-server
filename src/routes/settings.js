const express = require("express");
const User = require("../models/user");
const Settings = require("../models/settings");

const router = express.Router();


// Update settinsg
router.post('/updateSettings', (req, res) => {
    const data = req.body.data

    if (data) {
        if (
            data.token &&
            data.email &&
            data.phone &&
            data.instagram &&
            data.twitter &&
            data.facebook &&
            data.address
        ) {
            User.findOne({ token: data.token }, (err, user) => {
                if (user) {
                    if (user.login) {
                        Settings.findOne({}, (err, settings) => {
                            settings.email = data.email
                            settings.phone = data.phone
                            settings.instagram = data.instagram
                            settings.twitter = data.twitter
                            settings.facebook = data.facebook
                            settings.address = data.address
                            settings.save(res.json({ msg: 'updated' }))
                        })
                    } else res.json({ el: false })
                } else res.json({ el: false })
            })
        } else res.json({ el: false })
    } else res.json({ el: false })
})


router.get('/getSettings', (req, res) => Settings.findOne({}, (err, settings) => res.json(settings)))


module.exports = router