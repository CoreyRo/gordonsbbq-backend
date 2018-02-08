const router = require("express").Router();
const db = require('../models')
const fs = require('fs');
const path = require('path')
const mongoose = require('mongoose')
const getMongoDB = require('./config')
const expressValidator = require('express-validator');
router.use(expressValidator());

router.post('/runmongo', function(req,res,next){
    req.checkBody('uri', 'Mongo URI field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('password', 'Password field cannot be empty.').notEmpty();
    const errors = req.validationErrors()
    let username = req.body.username.trim()
    let password = req.body.password
    let mongo_uri = req.body.uri.trim()
    if(errors){
        console.log(`run mongo POST errors: ${JSON.stringify(errors)}`)
        return res.render('config', { 
            title: 'Config Error(s)', 
            errors: errors
        })
    }
    res.ren
    fs.writeFile(path.join(__dirname, "../tmp/mongo"), `${mongo_uri},${username},${password}`, function(err){
        if(err){
            console.log("FILESYSTEM WRITE ERROR", err)
            return res.render('config', { 
                title: 'Node fs error', 
                errors: [{
                    msg: `Node filesystem Error No. ${err.errno}, Error code: ${err.code}`
                }] 
            })
        }
        else{
            console.log('FILESYSTEM WRITE SUCCESS!')
            getMongoDB(res, function(data){
                return res.redirect('/login')
 
                
            })
        }
    })
});


module.exports = router;



// "mongodb://heroku_bv6lb71p:heroku_bv6lb71p@ds125058.mlab.com:25058/heroku_bv6lb71p"