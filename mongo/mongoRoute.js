const router = require("express").Router();
const db = require('../models')
const fs = require('fs');
const path = require('path')
const mongoose = require('mongoose')
const getMongoDB = require('./config')
const expressValidator = require('express-validator');
router.use(expressValidator());

//Post route to configure mongo
router.post('/runmongo', function(req,res,next){

    //req validations before writing
    req.checkBody('uri', 'Mongo URI field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('password', 'Password field cannot be empty.').notEmpty();
    const errors = req.validationErrors()
    if(errors){
        console.log(`run mongo POST errors: ${JSON.stringify(errors)}`)
        return res.render('config', { 
            title: 'Config Error(s)', 
            errors: errors
        })
    }

    //Temp file write after validation
    let username = req.body.username.trim()
    let password = req.body.password
    let mongo_uri = req.body.uri.trim()
    fs.writeFile(path.join(__dirname, "../tmp/mongotmp.txt"), `${mongo_uri},${username},${password}`, function(err){
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
            //Function I wrote to insert the data into the mongooose.connect()
            //see ./config.js
            getMongoDB(res, function(data){
                return res.redirect('/login')
            })
        }
    })
});

module.exports = router;

