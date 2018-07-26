var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({
    dest: 'public/images/'
});
var Event = require('../models/event');

var multerconf = {
    storage: multer.diskStorage({
        destination: function(req, file, next) {
            next(null, './public/images/event_featured_image');
        },
        filename: function(req, file, next) {
            var ext = file.mimetype.split('/')[1];
            next(null, file.fieldname + '-' + Date.now() + '.' + ext);
        }
    }),
    fileFilter: function(req, file, next) {
        if (!file) {
            next();
        }
        var image = file.mimetype.startsWith('image/');
        if (image) {
            next(null, true);
        } else {
            next({
                message: "Fle Not supported "
            }, false);
        }
    }
};
/* GET users listing. */

router.get('/event', function(req, res, next) {
    res.render('eventcreate');

});

router.get('/view-events', function(req, res) {
    Event.getAllEvents(function(err, events) {
        if (err) {
            throw err;
        } else {
        // 
//        res.render('index',function(err,events){
    res.render('index',{

      event_name:'Hello there'

    });

//res.json(events); 


//      });
    }
    });
});
   
router.get('/view-events/:id', function(req, res) {
    Event.getEventById(req.params.id,function(err, events) {
        if (err) {
            throw err;
        } else {

        res.json  
        }
    });
});



router.post('/event', multer(multerconf).single('event_image'), function(req, res, next) {
    var event_name = req.body.event_name;
    var event_description = req.body.event_description;
    var event_start_date = req.body.event_start_date;
    var event_end_date = req.body.event_end_date;
    var event_start_time = req.body.event_start_time;
    var event_end_time = req.body.event_end_time;
    var event_image = req.body.event_image;
    var posted_user_id = req.body.posted_user_id;
    var event_category = req.body.event_category;
    var event_city = req.body.event_city;
    var posted_user_id = req.body.posted_user_id;
    var event_area = req.body.event_area;
    var created_at = req.body.created_at = new Date();
    var event_organizer_name = req.body.event_organizer_name;
    var event_organizer_phone = req.body.event_organizer_phone;

    // validation
    req.checkBody('event_name', 'Event Name is Required').notEmpty();
    req.checkBody('event_description', 'Event Description is Required').notEmpty();
    req.checkBody('event_start_date', 'Event Start Date is Required').notEmpty();
    req.checkBody('event_end_date', 'Event End Date  is Required').notEmpty();
    req.checkBody('event_start_time', 'Event Start Time is Required').notEmpty();
    req.checkBody('event_end_time', 'Event  End Time  is Required').notEmpty();
    req.checkBody('posted_user_id').notEmpty();
    req.checkBody('event_category', 'Event Category is Required').notEmpty();
    req.checkBody('event_city', 'Event City is Required').notEmpty();
    req.checkBody('event_area', 'Event Area is Required').notEmpty();
    req.checkBody('event_organizer_name', 'Event Organizer is Required').notEmpty();
    req.checkBody('event_organizer_phone', 'Event Organizer Phone is Required').notEmpty();

    if (req.file) {
        console.log(req.file);
        var event_image = req.body.event_image1 = req.file.filename;
    }

    var errors = req.validationErrors();

    if (errors) {
        res.render('eventcreate', {
            errors: errors
        });
    } else {
        var newEvent = new Event({
            event_name: event_name,
            event_description: event_description,
            event_start_date: event_start_date,
            event_end_date: event_end_date,
            event_start_time: event_start_time,
            event_end_time: event_end_time,
            event_image: event_image,
            posted_user_id: posted_user_id,
            created_at: created_at,
            event_category: event_category,
            event_city: event_city,
            event_area: event_area,
            event_organizer_name: event_organizer_name,
            event_organizer_phone: event_organizer_phone

        });
        Event.createEvent(newEvent, function(err, event) {
            if (err) throw err;
            console.log(event);
        });
 req.flash('success_msg', 'You are registered your event ');
        res.redirect('/');
    }

});



module.exports = router;