var express = require('express');
var router = express.Router();
const multer = require('multer');
const uploads= multer({dest: './uploads'});
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
let User = require('../model/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req,res)=> {
  res.render('register');
});

router.get('/login', (req,res)=> {
  res.render('login');
});

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/users/login' }),
  function(req, res) {
    res.flash('success', 'You are now logged in');
    res.redirect('/');
  });

  // used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id); 
});
// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
      done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.getUserByUsername(username, (err, user)=> {
    if(err) throw err;
    if(!user) {
      return done(null,false, {message : "Uknown User"});
    }

    User.comparePassword(password, user.password, (err, match)=> {
      if(err) return done(err);
      if(match) {
        return done(null, user);
      }
      else {
        return done(null, false, {message : 'Invalid Password'});
      }
    });
  });
}));


router.post('/register', uploads.single('profileimage'), (req, res, next)=> {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  /* if(req.file) {
    console.log('...uploading File');
    var profileimage = req.file.filename;

  }
  else {
    var profileimage = 'noimage.jpg';
    console.log('No File uploaded');
  } */

  // form validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'username field is required').notEmpty();
  req.checkBody('password', 'password field is required').notEmpty();
  req.checkBody('password2', 'password2 field is required').notEmpty();
  req.checkBody('password2', 'passwords do not match').equals(req.body.password);
  //check Errors
  let errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      errors : errors
    });
  }
  else {
    let newUser = new User({
      name : name,
      email: email,
      username : username,
      password: password,
     // profileimage: profileimage
    });

    User.createUser(newUser, (err, user)=> {
      if(err) throw err
      console.log(user);
    });

    req.flash('success', 'you registered successufully and can log in');

    res.location('/');
    res.redirect('/');
  }
})













module.exports = router;
