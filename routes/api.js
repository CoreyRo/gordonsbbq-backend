
const router = require("express").Router();
const user = require('../controllers/userController.js')
const blog = require('../controllers/blogController.js')
const passport = require('passport')


router
    .route('/login')
    .post(user.findOne)

router
    .route('/getall')
    .get(blog.findAll)

router.get('/changetouri', function(req,res){
    console.log('here')
    res.render('login')
})

router.get('/toggle-mongo', function(req,res){
    console.log('toggle here')

})
    
// passport.serializeUser(function(user_id, done) {
//     console.log("userserial", user_id)
//     done(null, user_id);
//     });
    
// passport.deserializeUser(function(user_id, done) {
//     console.log("userDeserial", user_id)
//     done(null, user_id);
// });
        

module.exports = router;
