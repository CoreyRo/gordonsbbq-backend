const passport = require('passport')

module.exports = {

  serial: passport.serializeUser(function(user_id, done) {
    done(null, user_id);
    }),
  
  deserial: passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
  })
}


