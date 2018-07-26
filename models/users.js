//user Schema
var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');
var UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        index: true
    },
    lastname: {
        type: String
    },
    email: {
        type: String

    },
    user_bio: {
        type: String,
        index: true
    },
    phone: {
        type: String
    },
    gender: {
        type: String

    },
    avatar: {
        type: String,
        default: 'default_profile.jpg'

    },
    password: {
        type: String

    }
});
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
    bcryptjs.genSalt(10, function(err, salt) {
        bcryptjs.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);

        });
    });
}

module.exports.getUserByUsername = function(email, callback) {
    var query = {
        email: email
    };
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {

    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcryptjs.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}