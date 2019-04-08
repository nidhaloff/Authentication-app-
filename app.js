const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const routes = require('./routes/index');
const users = require('./routes/users');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const multer = require('multer');
const uploads= multer({dest: './uploads'});
const expressValidator= require('express-validator');
const bcrpyt = require("bcryptjs");
const db = mongoose.connection;
//console.log(process.env.MONGO_URL);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle File Uploads
//app.use();

// session Middleware: Handle Session
app.use(session({
  secret: 'sercret',
  saveUninitialized: true,
  resave: true
}));

// PAssport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', routes);
app.use('/users', users);

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

app.listen(3000, ()=> console.log('server listening on port 3000'));

module.exports = app;
