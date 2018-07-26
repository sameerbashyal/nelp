var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({
    dest: 'public/images/'
});
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Eventap'
    });
});

router.get('/signin', function(req, res, next) {
    res.render('signin', {
        title: 'Eventap'
    });

});

router.get('/userprofile/:id', ensureAuthenticated, function(req, res, next) {
    res.render('userprofile');
});
router.put('/userprofile/:id', ensureAuthenticated, function(req, res, next) {

    var query = {"_id": req.params.id};
    req.assert('firstname', 'Name is required').notEmpty();
    req.assert('user_bio', 'Bio is required').notEmpty();
    req.assert('city', 'City is required').notEmpty();
    req.assert('street', 'street  is required').notEmpty();
    req.assert('phone', 'Phone is required').notEmpty();
    req.assert('gender', 'Genderis required').notEmpty();
    var errors = req.validationErrors();
    if( !errors) {
        var update = {
            firstname: req.body.firstname,
            user_bio: req.body.user_bio,
            city: req.body.city,
            street: req.body.street,
            phone: req.body.phone,
            gender: req.body.gender
        };
        // var options = {new: true};
        // User.update(query, update, /*options,*/ function (err, data) {
            User.update(query, update, /*options,*/ function (err, data) {
            res.redirect('users/userprofile/:id');
        });
    }
    else{

        var query = {"_id": req.params.id};
        User.findOneAndUpdate(query, function(err, data){
            console.log(data)
            res.render('users/userprofile/:_id');
        });
        console.log(errors);

    }

});

// Register User  Signup
router.get('/signup', function(req, res, next) {
    res.render('signup', {
        title: 'Eventap'
    });
});


router.post('/signup', function(req, res, next) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var avatar = req.body.avatar;
    var password2 = req.body.password2;
    // validation
    req.checkBody('firstname', 'Firstname is Required').notEmpty();
    req.checkBody('lastname', 'Lastname is Required').notEmpty();
    req.checkBody('email', 'Email is Required').isEmail();
    req.checkBody('password', 'Password is Required').notEmpty();
    req.checkBody('password2', 'passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('signup', {
            errors: errors
        });
    } else {
        var newUser = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            avatar: avatar,
            password: password
        });
        User.createUser(newUser, function(err, user) {

            if (err) throw err;
            console.log(user);
        });
        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/users/signin');
    }

});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {


        // GET USER NAME

        User.getUserByUsername(email, function(err, user) {

            if (err) throw err;
            if (!user) {
                return done(null, false, {
                    message: 'Unknown User'
                });

            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {

                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
            });
        });
    }));



passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});



//USER SIGN IN 


router.post('/signin', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/signin',
        failureFlash: true
    }),
    function(req, res) {
        res.redirect('/users/userprofile');

    });

router.get('/signout', function(req, res) {
    req.logout();
    req.flash('success_msg', ' you are logged out ');
    res.redirect('/users/signin');
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();

    } else {
        //req.flash('error_msg','You are not logged in ');
        res.redirect('/');
    }

}

module.exports = router;