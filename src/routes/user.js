const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const randGen = require("../utils/randGen");
const router = express.Router();


// Create user
router.post("/create", (req, res) => {
    const data = req.body.data;

    if (data) {
        if (data.token && data.username && data.password && data.photo) {
            User.findOne({ token: data.token }, (err, user) => {
                if (user) {
                    if (user.login) {
                        User.findOne({ username: data.username }, (err, user) => {
                            if (user) {
                                res.json({ msg: "there is" });
                            } else {
                                data.uuid = randGen(100);
                                data.token = randGen(100);

                                const newUser = new User(data);

                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                                        newUser.password = hash;

                                        newUser.save(err => {
                                            if (err) res.json({ success: false })
                                            else res.json({ token: data.token })
                                        });
                                    });
                                });
                            }
                        });
                    } else res.json({ success: false })
                } else res.json({ success: false })
            })
        } else res.json({ success: false });
    } else res.json({ success: false });
});


// Update user data
router.post('/update', (req, res) => {
    const data = req.body.data

    if (data) {
        if (data.token, data.user && data.photo && data.username) {
            User.findOne({ token: data.token }, (err, user) => {
                if (user) {
                    if (user.login) {
                        User.findOne({ uuid: data.user }, (err, user) => {
                            if (user) {
                                user.photo = data.photo

                                if (user.username === data.username) {
                                    user.save(err => {
                                        if (err) res.send({ success: false })
                                        else res.send({ success: true })
                                    })
                                }
                                else {
                                    User.findOne({ username: data.username }, (err, isTaken) => {
                                        if (isTaken) res.json({ msg: "taken" })
                                        else {
                                            user.username = data.username
                                            user.save(err => {
                                                if (err) res.json({ success: false })
                                                else res.json({ success: true })
                                            })
                                        }
                                    })
                                }
                            } else res.json({ success: false })
                        })
                    } else res.json({ success: false })
                } else res.json({ success: false })
            })
        } else res.json({ success: false })
    } else res.json({ success: false })
})


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
                            user.token = randGen(100)

                            user.save(err => {
                                if (err) res.json({ success: false })
                                else res.json({ token: user.token })
                            })
                        } else res.json({ success: false });
                    });
                } else res.json({ success: false })
            })
        } else res.json({ success: false })
    } else res.json({ success: false })
});


// Logout
router.post('/logout', (req, res) => {
    User.findOne({ token: req.body.token }, (err, user) => {
        if (user) {
            user.login = false

            user.save(err => {
                if (err) res.json({ success: false })
                else res.json({ success: true })
            })
        } else res.json({ success: false })
    })
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
                                    User.findOne({ uuid: data.user }, (err, user) => {
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
            if (user.login) {
                User.find({}, (err, users) => {
                    if (users) {
                        res.json(users)
                    } else res.json({ el: "auth" })
                })
            } else res.json({ el: "auth" })
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
