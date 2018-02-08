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
const routes = require('./routes/index.js')
const session = require('express-session')
const passport = require('passport')
const app = express();
const PORT = process.env.PORT || 3000

//random string gen for express-session cookie
function makeid() {
	let text = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let strLen = Math.floor((Math.random() * 40) + 25)
	for(let i=0; i < strLen; i++)
	text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text.toString();
}

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
  	secret: makeid(),
  	resave: false,
  	saveUninitialized: false,
  	// cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

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

