// app/routes.js
var user 		= require('../app/models/user');
var bodyParser 	= require('body-parser');
const util 		= require('util');




module.exports = function(app, passport) {
	var multer 		= require('multer');
	var upload = multer({dest: './submissions/2019/settlement_generation/submissions/'});
	var fs = require('fs');

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	// ================================================================
	// HOMEPAGE
	// ================================================================
	app.get('/', function(req, res) {
		let isAuthed = req.isAuthenticated();
		if(isAuthed)
		{
			res.render('index.ejs', { message: req.flash('homeMessage'), isAuthed : isAuthed, user : req.user });
		}
		else {
			res.render('index.ejs', { message: req.flash('homeMessage'), isAuthed : isAuthed });
		}
	});

	// ================================================================
	// ABOUT
	// ================================================================
	app.get('/about', function(req, res) {
		let isAuthed = req.isAuthenticated();
		if(isAuthed)
		{
			res.render('about.ejs', { message: req.flash('homeMessage'), isAuthed : isAuthed, user : req.user });
		}
		else {
			res.render('about.ejs', { message: req.flash('homeMessage'), isAuthed : isAuthed });
		}
	});

	// ================================================================
	// RULES
	// ================================================================
	app.get('/rules', function(req, res){
		let isAuthed = req.isAuthenticated();
		if(isAuthed) {
			res.render('rules.ejs', { message: req.flash('rulesMessage'), isAuthed : isAuthed, user : req.user });
		}
		else {
			res.render('rules.ejs', { message: req.flash('rulesMessage'), isAuthed : isAuthed });
		}
	});
	// ================================================================
	// RESEARCH
	// ================================================================
	app.get('/research', function (req, res) {
		let isAuthed = req.isAuthenticated();
		if (isAuthed) {
			res.render('research.ejs', { message: req.flash('rulesMessage'), isAuthed: isAuthed, user: req.user });
		}
		else {
			res.render('research.ejs', { message: req.flash('rulesMessage'), isAuthed: isAuthed });
		}
	});

	// ================================================================
	// SUBMIT
	// ================================================================
	app.get('/submit', function(req, res) {
		let isAuthed = req.isAuthenticated();
		if(isAuthed)
		{
			res.render('submit.ejs', { message: req.flash('homeMessage'), isAuthed : isAuthed, user : req.user });
		}
		else {
			res.render('index.ejs', { message: req.flash('notlLoggedInMessage'), isAuthed : isAuthed });
		}
	});

	app.post('/submitgenerator', upload.single('uploadMe'), function(req,res){
		let submissionAllowed = false;
		console.log(req.file);
		let isAuthed = req.isAuthenticated();
		if(isAuthed && submissionAllowed) {
			
			user.findById(req.session.passport.user, function(err, foundUser) {
			if (err) throw err;


			// update user info for submission
			if(foundUser.submissions == undefined) {
				foundUser.submissions = {};
				foundUser.submissions.s_2019 = {};

			}
			foundUser.submissions.s_2019.settlement_generator_submitted = true;
			foundUser.submissions.s_2019.settlement_generator_about = req.body.about;
			foundUser.submissions.s_2019.settlement_generator_name = req.body.generator_name;
			foundUser.submissions.s_2019.settlement_generator_submit_time = new Date();
			if(req.body.chronicleIncluded == undefined) {
				foundUser.submissions.s_2019.chronicle_included = false;
			} else if(req.body.chronicleIncluded == 'on') {
				foundUser.submissions.s_2019.chronicle_included = true;
				foundUser.submissions.s_2019.chronicle_about = req.body.chronicleAbout;
			}
			console.log("chronicle: " + req.body.chronicleAbout);
			// foundUser.submissions.s_2018.settlement_generator_hashname = req.file.name;
			// change file name to user email
			fs.rename('./submissions/2019/settlement_generation/submissions/' + req.file.filename,
			 './submissions/2019/settlement_generation/submissions/' + foundUser.email + '.zip', function(err) {
			    if ( err ) console.log('ERROR: ' + err);
			});
			// save the user
			foundUser.save(function(err) {
				if (err) throw err;

				console.log('Submission successfully updated!');
				});
				req.flash('profileMessage', 'Generator successfully updated!');
				res.render('profile.ejs', {isAuthed : isAuthed, user : foundUser, message: req.flash('profileMessage') });

			});
		}
		else if (isAuthed && !submissionAllowed) {
			user.findById(req.session.passport.user, function(err, foundUser) {
				res.render('profile.ejs', {isAuthed : isAuthed, user : foundUser, message: req.flash('profileMessage') });
			});
		}
		else {
			res.render('index.ejs', { message: req.flash('notlLoggedInMessage'), isAuthed : isAuthed });
		}



	});

	app.get('/results', function (req, res) {
		console.log(req.Url);
		console.log("Hello")
		let isAuthed = req.isAuthenticated();
		if (isAuthed) {
			res.render('results.ejs', { message: req.flash('homeMessage'), isAuthed: isAuthed, user: req.user });
		}
		else {
			res.render('results.ejs', { message: req.flash('homeMessage'), isAuthed: isAuthed });
		}
	});
	// 	console.log(req.body); //form fields
	// 	/* example output:
	// 	{ title: 'abc' }
	// 	 */
	// 	var teamname = req.body.team_name
	// 	var teamleader = req.body.team_lead_name
	// 	var email = req.body.email_address
	// 	var organization = req.body.organization_university
	// 	var stringToWrite = "START\n" + "Team-Name: " + teamname + "\nTeam-Leader: " + teamleader + "\nEmail: " + email + "\nOrganization: " + organization;

	// 	fs.writeFile(__dirname+"/submissions/2018/settlement_generation/submission_data/"+req.file.filename+".txt",
	// 		stringToWrite,
	// 	 	function(err) {
	// 			if(err) {
	// 				return console.log(err);
	// 			}
	// 		console.log("Data file saved!");
	// 	});
	// 	console.log(req.file); //form files

	// 	let sampleFile = req.file;

	// 	transporter.sendMail(mailOptions, function (err, info) {
	//    		if(err)
	//     		console.log(err)
	//    		else
	//      		console.log(info);
	// 	});
	// 	res.sendFile(__dirname+"/sites/submission-redirect.html");
	// });

	// =====================================
	// PROCESS UPDATE PROFILE=======================
	// =====================================
	// process the update profile form
	app.post('/save-profile', isLoggedIn, function(req, res) {
	    var nUser;
	    let isAuthed = req.isAuthenticated();
	    user.findById(req.session.passport.user, function(err, foundUser) {
		if (err) throw err;

		console.log('updating with this info:\n'
			+ req.body.firstName + '\n'
			+ req.body.lastName + '\n'
			+ req.body.affiliation + '\n'
			+ req.body.country + '\n'
			+ req.body.website);
        foundUser.firstName		= req.body.firstName,
        foundUser.lastName 		= req.body.lastName,
        foundUser.website 		= req.body.website,
        foundUser.affiliation 	= req.body.affiliation,
	    foundUser.country		= req.body.country,
	    foundUser.edit_date		= new Date()
		// save the user
		console.log(foundUser);
		foundUser.save(function(err) {
			if (err) throw err;

			console.log('User successfully updated!');
			});
			req.flash('profileMessage', 'User info successfully updated!');
			res.render('profile.ejs', { message: req.flash('profileMessage'), user : foundUser, isAuthed : isAuthed });
		});


	});

	// get a user with ID of 1


	// ================================================================
	// LOGIN
	// ================================================================
	app.get('/login', function(req, res) {
        let isAuthed = req.isAuthenticated();
        let user = req.user;
        res.render('login.ejs', { isAuthed : isAuthed, message: req.flash('loginMessage') });
	});

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


	// ================================================================
	// SIGNUP
	// ================================================================
	// show the signup form
	app.get('/signup', function(req, res) {
		let isAuthed = req.isAuthenticated();
		// render the page and pass in any flash data
		if(!isAuthed) {
			res.render('signup.ejs', { isAuthed : isAuthed, message: req.flash('signupMessage') });
		}

	});

  	// process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	// ================================================================
	// PROFILE
	// ================================================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		let isAuthed = req.isAuthenticated();
		res.render('profile.ejs', { user : req.user, isAuthed : isAuthed, message : req.flash('profileMessage') });
	});

	// ================================================================
	// LOGOUT
	// ================================================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {
	// if user is authenticated
	if(req.isAuthenticated())
		return next();

	// if they aren't, redirect them to home page
	res.redirect('/');
}
