const router = require("express").Router();
const db = require('../models')
const fs = require('fs');
const path = require('path')
const mongoose = require('mongoose')
const getMongoDB = require('./config')


router.post('/runmongo', function(req,res,next){
    let mongo_uri = req.body.uri
    console.log("mongo URI", mongo_uri)

    fs.writeFile(path.join(__dirname, "../tmp/mongo"), mongo_uri, function(err){
        if(err){
            return console.log("WRITE ERROR", err)
        }
        else{
            console.log('FILE SAVED!')
            
            getMongoDB(function(data){
                console.log("Read this data", data)
                res.json(data)
            })
        }
    })
});


module.exports = router;



// "mongodb://heroku_bv6lb71p:heroku_bv6lb71p@ds125058.mlab.com:25058/heroku_bv6lb71p"