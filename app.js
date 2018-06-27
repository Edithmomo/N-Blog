var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var config = require("./config/config");
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var writeBlogRouter = require('./routes/writeBlog');
var piclistRouter = require('./routes/piclist');
var aboutAsRouter = require('./routes/aboutAs');
var detailsRouter = require('./routes/details');
var searchRouter = require('./routes/search');
var personalDataRouter = require('./routes/personalData');

var app = express();

app.use(
  session({
    secret: config.name,
    resave: false,
    saveUninitialized: true,
    // cookie:{maxAge:1000*60*2},
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json({limit: '10mb'})); 
app.use(bodyParser.urlencoded({limit: '10mb', extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', loginRouter);
app.use('/registers', registerRouter);
app.use('/findpassword', loginRouter);
app.use('/writeBlog', writeBlogRouter);
app.use('/piclist', piclistRouter);
app.use('/aboutAs', aboutAsRouter);
app.use('/details', detailsRouter);
app.use('/search', searchRouter);
app.use('/personalData', personalDataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
