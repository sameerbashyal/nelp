var express = require('express');
var router = express.Router();
var Event = require('../models/event');
/* GET home page. */
router.get('/',   function(req, res,next){
   Event.getAllEvents(function(err, events) {
     if (err) {
         throw err;
     } else {

        //res.json(events);

 res.render('index',{ title: 'Eventap'});
     }
 });


});


router.get('/about',ensureAuthenticated, function(req, res, next) {
res.render('about',{ title: 'Eventap'});
});
router.get('/createEvent',ensureAuthenticated, function(req, res, next) {
res.render('eventcreate',{ title: 'Eventap'});
});
function ensureAuthenticated(req,res,next){
if(req.isAuthenticated()){
return next();
}
else{
//req.flash('error_msg','You are not logged in ');
res.redirect('/');
}
}
module.exports = router;