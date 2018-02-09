'use strict'

const express = require('express');
const exphbs = require('express-handlebars')
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const mongoose = require('mongoose')
const db = require("./models")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

const app = express();
const PORT = process.env.PORT || 3000


// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1/gordons-bbq")

// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log(`Mongoose default connection open to ${process.env.MONGODB_URI || "mongodb://127.0.0.1/gordons-bbq"}`);
}); 
// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log(`Mongoose default connection error: ${err}`);
}); 
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});
// If the Node process ends, close the Mongoose connection 
// process.on('SIGINT', function() {  
// 	mongoose.connection.close(function () { 
// 	  console.log('Mongoose default connection disconnected through app termination'); 
// 	  process.exit(0); 
// 	}); 
// }); 



// ******************************************************************************
// *** setup express-handlebars instance
// ==============================================================================
var hbs = exphbs.create({
	defaultLayout:'main',
  	// Specify helpers which are only registered on this instance.
  	helpers: {
		foo: function () { return 'FOO!'; },
		bar: function () { return 'BAR!'; }
  	}
});
// view engine setup
app.engine('handlebars', hbs.engine)
app.set('view engine', '.handlebars');
// Handlebars default config
const partialsDir = __dirname + '/views/partials';

// ******************************************************************************
// *** Express app setup
// ==============================================================================
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  	secret: 'asdfhtreyarsegfASASGGvhfSDVBrfhteadgnOAJHWEgubnlikjfsaddfjhanbSFR',
  	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ 
		mongooseConnection: mongoose.connection,
		autoRemove: 'interval',
      	autoRemoveInterval: 20 // In minutes. Default
	})
  	// cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.isAuthenticated = req.isAuthenticated();
	next()
});

//routes


require("./routes/html.js")(app);
require("./routes/api.js")(app);
require("./routes/db.js")(app);


require('./passport/config.js')(passport, db.User);
var authRoute = require('./auth/auth.js')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});


app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

