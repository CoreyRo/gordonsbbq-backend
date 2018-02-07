const router = require("express").Router();

router.get('/', function(req, res, next) {
    console.log('User', req.user)
    console.log('Authenticated', req.isAuthenticated())
    res.render('home', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

router.get('/profile', function(req, res, next) {
    res.render('profile', { title: 'Express' });
});


module.exports = router
  
