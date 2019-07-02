const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const randGen = require("../utils/randGen");
const router = express.Router();

const generateLength = 100;


// Create new user
router.post("/createUser", (req, res) => {
    const data = req.body.data;

    if (data) {
        if (data.username && data.password) {
            if (
                data.username.length > 2 &&
                data.username.length < 21 &&
                data.password.length > 7 &&
                data.password.length < 17
            ) {
                User.findOne({ username: data.username }, (err, user) => {
                    if (user) {
                        res.json({ el: "there is" });
                    } else {
                        data.uuid = randGen(generateLength);
                        data.token = randGen(generateLength);

                        const newUser = new User(data);

                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                newUser.password = hash;

                                newUser.save(res.json({ token: data.token }));
                            });
                        });
                    }
                });
            } else res.json({ el: false });
        } else res.json({ el: false });
    } else res.json({ el: false });
});


router.post("/login", (req, res) => {
    const data = req.body.data;

    if (data) {
        if (data.username && data.password) {
            User.findOne({ username: data.username }, (err, user) => {
                if (user) {
                    bcrypt.compare(data.password, user.password, (err, result) => {
                        if (result) {

                            user.login = true
                            user.lastLogin = new Date().getTime()
                            user.token = randGen(100)

                            user.save(res.json({ token: user.token }))

                        } else res.json({ el: "password" });
                    });
                } else res.json({ el: "username" })
            })
        } else res.json({ el: false })
    } else res.json({ el: false })

});

module.exports = router;
