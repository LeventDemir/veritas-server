const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const randGen = require("../utils/randGen");
const router = express.Router();

const generateLength = 100;


// Create user
router.post("/createUser", (req, res) => {
    const data = req.body.data;

    if (data) {
        if (data.token && data.username && data.password && data.photo) {
            if (
                data.username.length > 2 &&
                data.username.length < 21 &&
                data.password.length > 7 &&
                data.password.length < 17
            ) {
                User.findOne({ token: data.token }, (err, user) => {
                    if (user) {
                        if (user.login) {
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
                        } else res.json({ el: false })
                    } else res.json({ el: false })
                })
            } else res.json({ el: false });
        } else res.json({ el: false });
    } else res.json({ el: false });
});


// Login
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

                        } else res.json({ el: false });
                    });
                } else res.json({ el: false })
            })
        } else res.json({ el: false })
    } else res.json({ el: false })
});


// Logout
router.post('/logout', (req, res) => {

    User.findOne({ token: req.body.token }, (err, user) => {
        if (user) {

            user.login = false

            user.save(res.json({ msg: "signed out" }))

        } else res.json({ el: false })
    })

})


// Update user data
router.post('/updateUserData', (req, res) => {

    const data = req.body.data

    if (data) {
        if (data.token, data.user && data.photo && data.username) {
            if (data.username.length > 2 && data.username.length < 21) {
                User.findOne({ token: data.token }, (err, user) => {
                    if (user) {
                        if (user.login) {
                            User.findOne({ uuid: data.user }, (err, user) => {
                                if (user) {
                                    user.photo = data.photo

                                    if (user.username === data.username) {
                                        user.save(res.send({ msg: "updated" }))
                                    }
                                    else {
                                        User.findOne({ username: data.username }, (err, isTaken) => {
                                            if (isTaken) {
                                                res.json({ el: "taken" })
                                            } else {
                                                user.username = data.username
                                                user.save(res.json({ msg: "updated" }))
                                            }
                                        })
                                    }
                                } else res.json({ el: "token" })
                            })
                        } else res.json({ el: false })
                    } else res.json({ el: false })
                })
            } else res.json({ el: false })
        } else res.json({ el: false })
    } else res.json({ el: false })

})


// Is auth
router.post('/isAuth', (req, res) => {

    User.findOne({ token: req.body.token }, (err, user) => {
        if (user) res.json({ isAuth: user.login })
        else res.json({ isAuth: false })
    })

})


// Remove user
router.post('/removeUser', (req, res) => {

    const data = req.body.data

    if (data) {
        if (data.user && data.token) {
            User.find({}, (err, users) => {
                if (users) {
                    if (users.length > 1) {
                        User.findOne({ token: data.token }, (err, user) => {
                            if (user) {
                                if (user.login) {
                                    User.findOne({ token: data.user }, (err, user) => {
                                        if (user) user.remove(res.json({ msg: 'removed' }))
                                        else res.json({ el: false })
                                    })
                                } else res.json({ el: false })
                            } else res.json({ el: false })
                        })
                    } else res.json({ el: 'length' })
                } else res.json({ el: false })
            })
        } else res.json({ el: false })
    } else res.json({ el: false })

})


// Get users
router.post('/getUsers', (req, res) => {

    User.findOne({ token: req.body.token }, (err, user) => {
        if (user) {
            if (user.login) User.find({}, (err, users) => res.json(users))
            else res.json({ el: "auth" })
        } else res.json({ el: false })
    })

})


// Get user
router.post('/getUser', (req, res) => {

    User.findOne({ token: req.body.token }, (err, user) => {
        if (user) {
            if (user.login)
                if (user) res.json({ uuid: user.uuid, photo: user.photo, username: user.username })
                else res.json({ el: "auth" })
        } else res.json({ el: false })
    })

})


module.exports = router;
