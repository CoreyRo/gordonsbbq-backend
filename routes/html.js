
const db = require('../models')

module.exports = function(router){

    router.get('/', function(req, res, next) {
         if(req.isAuthenticated()){
            res.render('home', {user: req.user.username})
        }
        else{
            res.render('login', { 
                title: 'The Redivo Group',
                subTitle: 'Admin Access Level',
                navBrand: 'ADMIN ACCESS LOGIN' 
            })
        }
    })
    router.get('/blog', function(req,res,next){
        db.Blog
        .paginate({}, {
            page: 1,
            limit: 6,
            sort: ({dateAdded:-1}),
        })
        .then(function(dbModel){
            console.log("Find Page Blog Post:\n", dbModel)
            res.render('blog', {
                blog: dbModel,
                user: req.user.username
            })
        })
        .catch(function(err){
            console.log("Find Page Blog Post Error:\n", err)
            res.json(err)
        })
    })

    router.get('/home', function(req, res){
        res.render('home', {user: req.user.username})
    })

    router.get('/newpost', function(req, res, next) {
        res.render('newblogpost')
    })





}


  
