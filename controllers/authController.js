const mongoose = require("mongoose");
const passport = require("passport");
const db = require("../models");
const fs = require("fs");
const bcrypt = require('bcrypt')
const saltRounds = 10
const async = require('async')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');

module.exports = {

    // Post /register
    registerUser: function (req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return (res.render('register', {
                title: 'Register new user',
                pageTitle: "Register new user",
                valErrors: errors.mapped(),
                req: req.body
            }))
        } else {
            let password = req.body.password
            let username = req
                .body
                .username
                .toLowerCase()
            let email = req
                .body
                .email
                .toLowerCase()
            let firstName = req.body.firstName
            let lastName = req.body.lastName
            bcrypt.hash(password, saltRounds, (err, hash) => {
                db
                    .User
                    .create({
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                        password: hash,
                        email: email,
                        isAdmin: req.body.isAdmin,
                        passwordResetToken: null,
                        passwordResetExpire: null
                    })
                    .then(dbModel => {
                        req.flash('success', 'New user was created.')
                        res.redirect('/home')
                    })
                    .catch(function (err) {
                        req.flash('error', 'There was a problem trying to register the new user')
                        res.redirect('/home')
                    })
            })
        }
    },

    // Post /login
    doLogin: function (req, res) {
        passport.authenticate('local-signin', {
            successRedirect: '/home',
            failureRedirect: '/'
        })
    },

    // Post /forgot-login
    doForgot: function (req, res, next) {
        async.waterfall([
            done => crypto.randomBytes(20, (err, buf) => done(err, buf.toString('hex'))),
            (token, done) => {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return (res.render('forgot', {
                        title: 'Forgot Password',
                        pageTitle: "Forgot Password",
                        subTitle: 'Enter the email address for your account',
                        valErrors: errors.mapped()
                    }))
                } else {
                    db
                        .User
                        .findOneAndUpdate({
                            email: req
                                .body
                                .forgetEmail
                                .toLowerCase()
                        }, {
                            resetPasswordToken: token,
                            resetPasswordExpire: Date.now() + 3600000 //60mins
                        })
                        .then(user => {
                            if (!user) {
                                res.render('forgot', {
                                    title: "Gordon's BBQ",
                                    errors: [
                                        {
                                            alertType: 'danger',
                                            alertIcon: 'fas fa-exclamation-triangle',
                                            msg: 'No account with that email address exists'
                                        }
                                    ],
                                    pageTitle: "Reset Password"
                                })
                            }
                            done(null, token, user)
                        })
                        .catch(err => {
                            done(err)
                        })
                }
            },
            (token, user, done) => {
                const smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'backend.test.address@gmail.com',
                        pass: process.env.GMAIL_PW
                    }
                })
                var mailOptions = {
                    to: user.email,
                    from: 'backend.test.address@gmail.com',
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of' +
                            ' the password for username: ' + user.username + '.\n\nPlease click on the following link, or paste this into your browser to comp' +
                            'lete the process:\n\nhttp://' + req.headers.host + '/reset/' + token + '\n\nIf you did not request this, please ignore this email and your password will' +
                            ' remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    done(err, 'done');
                    res.render('login', {
                        title: "Gordon's BBQ",
                        errors: [
                            {
                                alertIcon: 'fas fa-check',
                                alertType: 'success',
                                msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.'
                            }
                        ],
                        pageTitle: "Login"
                    })
                });
            }
        ], err => {
            if (err) {
                res.render('forgot', {
                    title: "Gordon's BBQ",
                    errors: [
                        {
                            alertType: 'danger',
                            alertIcon: 'fas fa-exclamation-triangle',
                            msg: 'Oops! Something went wrong. Please Re-enter your information.'
                        }
                    ],
                    pageTitle: "Oops! Something went wrong."
                })
            }

        })
    },

    doResetCheck: function (req, res, next) {
        db
            .User
            .findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpire: {
                    $gt: Date.now()
                }
            })
            .then(user => {
                if (!user) {
                    res.render('Login', {
                        title: "Gordon's BBQ",
                        errors: [
                            {
                                alertType: 'danger',
                                alertIcon: 'fas fa-exclamation-triangle',
                                msg: 'Oops! Password reset token is invalid or has expired.'
                            }
                        ],
                        pageTitle: "Oops! Something went wrong."
                    })
                } else {
                    res.render('reset', {
                        title: 'Reset Password',
                        pageTitle: "Reset Password",
                        subTitle: 'Enter a new password',
                        token: req.params.token
                    })
                }
            })
            .catch(err => {
                req.flash('error', 'An unexpected error occured.')
                res.redirect('/login')
            })
    },

    doReset: function (req, res, next) {

        async.waterfall([
            function (done) {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return (res.render('reset', {
                        title: 'Reset Password',
                        pageTitle: "Reset Password",
                        subTitle: 'Enter a new password',
                        token: req.params.token,
                        valErrors: errors.mapped()
                    }))
                }
                let password = req.body.password
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    let conditions = {
                        resetPasswordToken: req.params.token,
                        resetPasswordExpire: {
                            $gte: Date.now()
                        }
                    }
                    db
                        .User
                        .findOneAndUpdate(conditions, {
                            password: hash,
                            resetPasswordToken: null,
                            resetPasswordExpire: null
                        })
                        .then(user => {
                            if (!user) {
                                res.render('login', {
                                    title: "Gordon's BBQ",
                                    errors: [
                                        {
                                            alertType: 'danger',
                                            alertIcon: 'fas fa-exclamation-triangle',
                                            msg: 'Oops! Something went wrong.'
                                        }
                                    ],
                                    pageTitle: "Oops! Something went wrong."
                                })
                            }
                            done(null, user)
                        })
                        .catch(err => {
                            req.flash('error', 'There was an error updating.')
                            res.redirect('/home')
                        })
                })
            },
            function (user, done) {
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'backend.test.address@gmail.com',
                        pass: process.env.GMAIL_PW
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'backend.test.address@gmail.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\nThis is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    done(err, 'done');
                    if (req.isAuthenticated()) {
                        res.render('home', {
                            title: "Gordon's BBQ",
                            errors: [
                                {
                                    alertIcon: 'fas fa-check',
                                    alertType: 'success',
                                    msg: 'Success! Your password has been changed.'
                                }
                            ],
                            pageTitle: "Home"
                        })
                    } else {
                        res.render('login', {
                            title: "Gordon's BBQ",
                            errors: [
                                {
                                    alertIcon: 'fas fa-check',
                                    alertType: 'success',
                                    msg: 'Success! Your password has been changed.'
                                }
                            ],
                            pageTitle: "Login"
                        })
                    }
                });
            }
        ], err => {
            if (err) {
                res.render('forgot', {
                    title: "Gordon's BBQ",
                    errors: [
                        {
                            alertType: 'danger',
                            alertIcon: 'fas fa-exclamation-triangle',
                            msg: 'Oops! Something went wrong. Please Re-enter your information.'
                        }
                    ],
                    pageTitle: "Oops! Something went wrong."
                })
            }

        })

    },

    doPassChange: function (req, res, next) {

        async.waterfall([
            function (done) {
                db
                    .User
                    .findOne({username: req.user.username})
                    .then(user => {
                        let password = req.body.oldPassword
                        let hash = req.user.password
                        bcrypt.compare(password, hash, function (err, result) {
                            if (result) {
                                return done()

                            } else {
                                req.flash('error', 'Password entered does not match our records.')
                                res.redirect('/change-password')
                            }
                        })
                    })
            },

            function (done) {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return (res.render('changepass', {
                        title: 'Change Password',
                        pageTitle: "Change Password",
                        subTitle: 'Create a new password',
                        token: req.params.token,
                        valErrors: errors.mapped(),
                        user: req.user,
                        href: 'change-password'
                    }))
                }
                done()
            },

            function (done) {
                let password = req.body.password
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    db
                        .User
                        .findOneAndUpdate({
                            username: req.user.username
                        }, {password: hash})
                        .then(user => {
                            if (!user) {
                                req.flash('error', 'No user records found, please contact administrator or reset password via "Forgo' +
                                        't Password".')
                                res.redirect('/logout')
                            } else {
                                req.flash('success', 'Success! Password has been changed.')
                                res.redirect('/home')
                            }
                        })
                        .catch(err => {
                            req.flash('error', 'Fatal Error Occured, please contact administrator or reset password via "Forgot ' +
                                    'Password".')
                            res.redirect('/logout')
                        })
                })
            }
        ], err => {
            if (err) {
                req.flash('error', 'Fatal Error Occured, please try again.')
                res.redirect('/home')
            }

        })
    },

    usersPage: function (req, res) {
        db
            .Users
            .paginate({}, {
                page: parseInt(req.params.num),
                limit: 3,
                sort: ({updatedAt: -1})
            })
            .then(function (dbModel) {
                if (dbModel.docs.length <= 0) {
                    res.render('user', {
                        title: "The user database is empty",
                        subTitle: 'Click "Create a new user post" to start',
                        username: req.user.username,
                        user: req.user,
                        href: 'manage-users'
                    })
                } else {
                    res.render('user', {
                        users: dbModel,
                        title: 'User Accounts Page ' + dbModel.page + ' of ' + dbModel.pages,
                        username: req.user.username,
                        user: req.user,
                        type: 'users',
                        href: 'manage-users'
                    })
                }
            })
            .catch(function (err) {
                req.flash('error', 'There was an error finding users.')
                res.redirect('/home')
            })
    },

    update: function(req, res){
        async.waterfall([

            function (done) {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return (res.render('updateUser', {
                        title: "Update user information",
                        pageTitle: "Gordons BBQ - Update User",
                        subTitle: 'Update user information',
                        username: req.user.username,
                        valErrors: errors.mapped(),
                        user: req.user,
                        users: req.body,
                        href: 'manage-users'
                    }))
                }
                done()
            },
            function (done) {
                db
                    .User
                    .findOne({username: req.user.username})
                    .then(user => {
                        let password = req.body.password
                        let hash = req.user.password
                        bcrypt.compare(password, hash, function (err, result) {
                            if (result) {
                                return done()

                            } else {
                                req.flash('error', 'Password entered does not match our records.')
                                res.redirect('/change-password')
                            }
                        })
                    })
            },

            function(done){
                db.User.findOneAndUpdate({_id: req.body._id},
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    email: req.body.email
                })
                .then(user => {
                    req.flash('success', 'User information successfully updated.')
                    res.redirect('/manage-users')
                })
                .catch(err => {
                    req.flash('error', 'There was an error updating the user information.')
                    res.redirect('/manage-users')
                })
            }
        ])

    },

    findOne: function (req, res) {
        db
            .User
            .findOne({_id: req.params.id})
            .then(function (dbModel) {
                res.render('updateUser', {
                    users: dbModel,
                    title: "Update user information",
                    pageTitle: "Gordons BBQ - Update User",
                    subTitle: 'Update user information',
                    username: req.user.username,
                    user: req.user,
                    href: 'manage-users'
                })
            })
            .catch(function (err) {
                req.flash('error', 'There was an error finding that user.')
                res.redirect('/manage-users')
            })
    },



    destroy: function (req, res) {
        db
            .User
            .findOne({_id: req.params.id})
            .then(function (dbModel) {
                dbModel.remove()
                req.flash('success', 'User account was successfully removed.')
                res.redirect('/manage-users')
            })
            .catch(function (err) {
                req.flash('error', 'There was an error removing the account: ' + err)
                res.redirect('/manage-users')
            })
    },

}