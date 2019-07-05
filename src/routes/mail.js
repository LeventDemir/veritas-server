const express = require("express");
const nodemailer = require('nodemailer')
const Settings = require("../models/settings");

const router = express.Router();


router.post('/send', (req, res) => {

    const data = req.body.data

    if (data) {
        if (data.name && data.phone && data.email && data.subject && data.message) {
            Settings.findOne({}, (err, settings) => {

                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "musichub.email@gmail.com",
                        pass: "1453.1453"
                    }
                });

                const mailOptions = {
                    from: "musichub.email@gmail.com",
                    to: settings.email,
                    subject: data.subject,
                    text: data.message,
                    html: `
                    <p><b>İsim:</b> ${data.name}</p>
                    <p><b>Telefon:</b> ${data.phone}</p>
                    <p><b>Email:</b> ${data.email}</p>
                    <p><b>Konu:</b> ${data.subject}</p>
                    <p><b>Mesaj:</b> ${data.message}</p>
                    `
                };

                transporter.sendMail(mailOptions, err => {
                    if (err) res.json({ msg: 'err' })
                    else res.json({ msg: 'ok' })
                });

            })
        } else res.json({ el: false })
    } else res.json({ el: false })


})



module.exports = router