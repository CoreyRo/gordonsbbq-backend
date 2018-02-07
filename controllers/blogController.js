const db = require('../models')

module.exports = {
    create: function(req, res){
        if(Array.isArray(req.body)){
            db.Blog
                .collection
                .insert(req.body)
                .then(function(dbModel){
                    console.log("Create BULK Blog Post:\n", dbModel)
                    res.json(dbModel)
                })
                .catch(function(err){
                    console.log("Create BULK Blog Post Error:\n", err)
                    res.json(err)
                })
        }
        else{
            db.Blog
                .create(req.body)
                .then(function(dbModel){
                    console.log("Create New Blog Post:\n", dbModel)
                    res.json(dbModel)
                })
                .catch(function(err){
                    console.log("Create New Blog Post Error:\n", err)
                    res.json(err)
                })
        }
    },

    findPages: function(req,res){
        console.log("in find pages")
        db.Blog
        .paginate({}, {
            page: parseInt(req.params.num),
            limit: parseInt(req.params.limit),
            sort: ({dateAdded:-1}),
        })
        .then(function(dbModel){
            console.log("Find Page Blog Post:\n", dbModel)
            res.json(dbModel)
        })
        .catch(function(err){
            console.log("Find Page Blog Post Error:\n", err)
            res.json(err)
        })
    },

    findAll: function(req,res){
        console.log("in find all")
        db.Blog
            .find({})
            .sort({dateAdded:-1})
            .then(function(dbModel){
                console.log("Find All Blog Post:\n", dbModel)
                res.json(dbModel)
            })
            .catch(function(err){
                console.log("Find All Blog Post Error:\n", err)
                res.json(err)
            })
    },

    update: function(req, res){
        db.Blog
            .findOneAndUpdate({ _id: req.params.id }, req.body)
            .then(function(dbModel){
                console.log("update Blog Post:\n", dbModel)
            })
            .catch(function(err){
                console.log("update Blog Post Error:\n", err)
                res.json(err)                
            })
    },

    destroy: function(req, res){
        db.Blog
            .findById({ _id:req.params.id })
            .then(function(dbModel){
                console.log("destroy Blog Post:\n", dbModel)
                dbModel.remove()
                res.json(dbModel)                
            })
            .catch(function(err){
                console.log("destroy Blog Post Error:\n", err)
                res.json(err)
            })
    }
}



