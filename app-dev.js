// set up =====================================================
var multer = require('multer');
var fs = require("fs");

var express 	= require('express');
var path	= require('path');
var favicon 	= require('serve-favicon');
var logger 	= require('morgan');

var cookieParser	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var nodemailer 		= require('nodemailer');
var mongoose 		= require('mongoose');
var passport 		= require('passport');
var flash 		= require('connect-flash');

var morgan 		= require('morgan');
var session		= require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var configDB = require('./config/database.js');
// configuration ============================================

mongoose.connect('mongodb://localhost/db_name'); // connect to our DB

require('./config/passport')(passport); // pass passport for configuration

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.static('sites'));

app.use('/users', users);

// required for passport

app.use(require("express-session")({
    secret: "lordoftheringstrilogyispossiblythebestofalltime",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000 //1 hour
    }
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes =======================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport





// set up emailer
var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'gendesignmc@gmail.com',
        pass: ''
    }
});

const mailOptions = {
  from: 'gendesignmc@gmail.com', // sender address
  to: 'mcg520@nyu.com', // list of receivers
  subject: 'New Submission Notification', // Subject line
  html: '<p>A new submission has been uploaded to the server!</p>'// plain text body
};



// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.get('/',function(req,res){
//     res.sendFile(__dirname+'/index.html');
// });
// app.get('/about.html',function(req,res){
// 	res.sendFile(__dirname+'/about.html')
// });
// app.get('/submit.html',function(req,res){
// 	res.sendFile(__dirname+'/submit.html')
// });

module.exports = app;

var server = app.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Listening at http://%s:%s", host, port)
})
