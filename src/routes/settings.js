const express = require("express");
const User = require("../models/user");
const Settings = require("../models/settings");

const router = express.Router();


// Update settinsg
router.post('/updateSettings', (req, res) => {
    const data = req.body.data

    if (data) {
        if (data.token && data.email && data.phone && data.address) {
            User.findOne({ token: data.token }, (err, user) => {
                if (user) {
                    if (user.login) {
                        Settings.findOne({}, (err, settings) => {
                            if (settings) settings.remove()

                            new Settings(data).save(res.json({ msg: 'updated' }))
                        })
                    } else res.json({ el: false })
                } else res.json({ el: false })
            })
        } else res.json({ el: false })
    } else res.json({ el: false })
})


// get Settings
router.get('/getSettings', (req, res) => Settings.findOne({}, (err, settings) => {
    if (settings) {
        if (settings)
            res.json({
                email: settings.email,
                phone: settings.phone,
                instagram: settings.instagram,
                twitter: settings.twitter,
                facebook: settings.facebook,
                address: settings.address
            })
    }
}))


module.exports = router