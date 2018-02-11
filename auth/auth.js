
const router = require("express").Router();
const auth = require("../controllers/authController.js");

module.exports = function(router, passport){

    router
        .route("/auth/create")
        .post(auth.doRegister)

    
    router.post('/auth/login', passport.authenticate('local-signin', {
            successRedirect: '/home',
            failureRedirect: '/'
            }
        ))

    router.get('/logout', function(req,res){
            req.logout()
            req.session.destroy()           
            res.redirect('/')
    })
}

// router.post('/create', function(req,res,next){
//     console.log('in auth')
//     let username = req.body.username
//     let password = req.body.password
//     bcrypt.hash(password, saltRounds, function(err, hash) {
//         db.User
//         .create({
//             username: req.body.username,
//             password: hash
//         })
//         .then(function(dbModel){
//             db.User.findOne({_id: dbModel._id})
//             .then(function(dbResult){
//                 console.log(`Logging in user: ${dbResult.username}`)
//                 const user_id = dbResult._id
//                 req.login(user_id, function(err){
                    
//                     if (err) {
//                         console.log("req.login error:", err)
//                         return err
//                     }
//                     else{
//                         console.log(`Logged in user: ${dbResult.username}`)
//                         res.redirect('/')
//                     }

//                 })
//             })
//             .catch(function(err){
//                 console.log("UserFound Error:\n", err)
//                 res.json(err)
//             })
//         })
//         .catch(function(err){
//             console.log("Create New User Error:\n", err)
//             res.json(err)
//         })
//     })
// })

// router.post('/login', passport.authenticate(
//     'local', {
//     successRedirect: '/home',
//     failureRedirect: '/'
//     }
// ))

// passport.use(new LocalStrategy(
//     function(username, password, done) {
//             db.User
//             .findOne({username})
//             .then((user) =>{
//                 if (!user){
//                     console.log('No user found')
//                     return done(null, false, { 
//                         errors: [
//                             {msg: 'No user found'}
//                         ]  
//                     })
//                 }
//                 else{
//                     const hash = user.password
//                     bcrypt.compare(password, hash, function(err,res){
//                         if (res) {              
//                             return done(null, user)
//                         }
//                         else{
//                             return done(null, false)
//                         }
//                     })
//                 }
//             })
//             .catch((err) =>{
//                 console.log('login find username err:', err)
//                 return done(err)
//             })

// }))


// passport.serializeUser(function(user, done) {
//     console.log("Serial us", user._id)
//     done(null, user._id);
//   });
  
//   passport.deserializeUser(function(id, done) {
//     console.log("DEerial user_id", user._id)
//     User.findById({_id: user._id }, function(err, user) {
//         done(err, user);
//     });
//   });

// }

