const router = require("express").Router();
let toggle = true

router.get('/', function(req, res, next) {
    res.render('config', { 
        title: `Gordon's BBQ Backend`,
        subTitle: `Mongo Database Config`,
        toggler: toggle
    });
});


router.post('/', function(req, res, next) {
    toggle = !toggle
    res.render('config', { 
        title: `Gordon's BBQ Backend`,
        subTitle: `Mongo Database Config`,
        toggler: toggle        
    });
    
});

router.get('/login', function(req, res, next) {
    res.render('login', { 
        title: 'GordonsBBQ.net',
        subTitle: 'Admin Access Level',
        navBrand: 'ADMIN ACCESS LOGIN' 
    });
});

router.get('/home', function(req, res, next) {
    console.log('User', req.user)
    console.log('Authenticated', req.isAuthenticated())
    res.render('home', { title: 'Express' });
});

router.get('/profile', function(req, res, next) {
    console.log('User', req.user)
    console.log('Authenticated', req.isAuthenticated())
    res.render('profile', { title: 'Express' });

});


module.exports = router
  
