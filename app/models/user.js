// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    email        : String,
    password     : String,
    firstName    : String,
    lastName     : String,
    country      : String,
    affiliation  : String,
    website      : String,
    join_date    : Date,
    edit_date    : Date,

    submissions  : {
        s_2018      : {
            settlement_generator_submitted      : Boolean,
            settlement_generator_name           : String,
            settlement_generator_about          : String,
            settlement_generator_submit_time    : Date,
            // settlement_generator_hashname       : String
        },
        s_2019 :{
            settlement_generator_submitted      : Boolean,
            settlement_generator_name           : String,
            settlement_generator_about          : String,
            settlement_generator_submit_time    : Date,
            chronicle_included                  : String,
            chronicle_about                     : String
        },
        s_2020 :{
            settlement_generator_submitted: Boolean,
            settlement_generator_name: String,
            settlement_generator_about: String,
            settlement_generator_submit_time: Date,
            chronicle_included: String,
            chronicle_about: String,
            team_name: String,
            publish_online: Boolean
        }
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
