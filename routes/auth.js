const router = require("express").Router();
const passport = require('passport')
const bcrypt = require('bcrypt')
const saltRounds = 10
const db = require('../models')
// const isLoggedIn =(req,res,next) => {
//     return req.isAuthenticated() ? next() : res.status(403).send("not authenticated")
//   }

router.post('/create', function(req,res,next){
    console.log("In create")
    let username = req.body.username
    let password = req.body.password
    bcrypt.hash(password, saltRounds, function(err, hash) {

        db.User
        .create({
            username: req.body.username,
            password: hash
        })
        .then(function(dbModel){
            console.log("Create New User:\n", dbModel)

            db.User.findOne({_id: dbModel._id})
            .then(function(dbResult){
                const user_id = dbResult._id
                console.log('id', user_id)
                req.login(user_id, function(err){
                    res.redirect('/')
                })
            })
            .catch(function(err){
                console.log("UserFound Error:\n", err)
                res.json(err)
            })
        })
        .catch(function(err){
            console.log("Create New User Error:\n", err)
            res.json(err)
        })
    })
})
// router.use(isLoggedIn)
// router.get('/admin', function(req,res){
// console.log("===========UserID===============",req.user)
// console.log("Authenticated:",req.isAuthenticated())
// res.json(req.user)
// })

passport.serializeUser(function(user_id, done) {
    console.log("Serial user_id", user_id)
    done(null, user_id);
  });
  
passport.deserializeUser(function(user_id, done) {
    db.User.findById(user_id, function(err, user) {
        console.log("DEerial user_id", user_id)
        done(err, user);
    });
});




module.exports = router;
