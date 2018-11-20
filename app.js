var multer = require('multer');
var fs = require("fs");

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(express.static('sites'));

app.get('/', (req, res) => res.render('index.ejs'))



app.use('/users', users);


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

// app.get('/about',function(req,res){
// 	res.render('about.html')
// });
app.get('/submit',function(req,res){
	res.render('submit.ejs')
});


app.post('/submitgenerator', multer({ dest: __dirname+'/submissions/2018/settlement_generation/submissions/'}).single('uploadMe'), function(req,res){
	console.log(req.body); //form fields
	/* example output:
	{ title: 'abc' }
	 */
	var teamname = req.body.team_name
	var teamleader = req.body.team_lead_name
	var email = req.body.email_address
	var organization = req.body.organization_university
	var stringToWrite = "START\n" + "Team-Name: " + teamname + "\nTeam-Leader: " + teamleader + "\nEmail: " + email + "\nOrganization: " + organization;

	fs.writeFile(__dirname+"/submissions/2018/settlement_generation/submission_data/"+req.file.filename+".txt",
		stringToWrite,
	 	function(err) {
			if(err) {
				return console.log(err);
			}
		console.log("Data file saved!");
	});
	console.log(req.file); //form files
	// console.log(req.files);
	/* example output:
            { fieldname: 'upl',
              originalname: 'grumpy.png',
              encoding: '7bit',
              mimetype: 'image/png',
              destination: './uploads/',
              filename: '436ec561793aa4dc475a88e84776b1b9',
              path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
              size: 277056 }
	 */
	let sampleFile = req.file;

	// Use the mv() method to place the file somewhere on your server
	// sampleFile.mv(__dirname+'/submissions/2018/settlement_generation/filename.zip', function(err) {
	// 	if (err)
	// 		return res.status(500).send(err);

	// 	res.send('File uploaded!');
	// res.status(204).end();
	// });
	transporter.sendMail(mailOptions, function (err, info) {
   		if(err)
    		console.log(err)
   		else
     		console.log(info);
	});
	res.sendFile(__dirname+"/sites/submission-redirect.html");
});

module.exports = app;

var server = app.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("Listening at http://%s:%s", host, port)
})
