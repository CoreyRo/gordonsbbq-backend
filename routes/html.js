
module.exports = function(router){

    router.get('/', function(req, res, next) {
        res.render('login', { 
            title: 'GordonsBBQ.net',
            subTitle: 'Admin Access Level',
            navBrand: 'ADMIN ACCESS LOGIN' 
        });
    });


    router.get('/home', function(req, res, next) {
        console.log('coming home')
        console.log('User', req.user)
        console.log('Authenticated', req.isAuthenticated())
        res.render('home', { title: 'Express' });
    });

    router.get('/profile', function(req, res, next) {

        res.render('profile', { title: 'Express' });

    });
}


  
