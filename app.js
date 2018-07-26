
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs= require('express-handlebars');
var expressValidator= require('express-validator');
var flash= require('connect-flash');
var session= require('express-session');
var passport= require('passport');
var LocalStrategy= require('passport-local');
var mongo= require('mongodb');
var mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/nelp');
//mongoose.connect('mongodb://localhost/furnitureland');
// mongoose.connect('localhost/furnitureland');

var db=mongoose.connection;

var indexRouter = require('./routes/index');
var eventRouter = require('./routes/events');
var usersRouter = require('./routes/users');

var app = express();
app.set('views',path.join(__dirname,'views'));
app.engine('hbs',exphbs({defaultLayout:'layout'}));
app.set('view engine','hbs');
app.use(logger('dev'));
// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({

secret:'secret',
saveUninitialized:true,
resave:true
}));

// passport init
app.use(passport.initialize());
app.use(passport.session());

// express validator

app.use(expressValidator({
errorFormatter:function(param,msg,value){

    var namespace=param.split('.')
    ,root=namespace.shift()
    ,formParam=root;
    while(namespace.length){

        formParam+='['+namespace.shift()+']';
    }
    return{
param:formParam,
msg:msg,
value:value
    };
}

}));

// connect flash middleware
app.use(flash());
app.use(function (req,res,next)
{
res.locals.success_msg=req.flash('success_msg');
res.locals.error_msg=req.flash('error_msg');
res.locals.error=req.flash('error');
res.locals.user=req.user || null;
next();
}
);
app.get('*',function(req,res,next)
{
    res.locals.user=req.user||null;
    next();
}
);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventRouter);
module.exports = app;
