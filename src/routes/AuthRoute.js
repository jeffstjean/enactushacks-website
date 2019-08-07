const router = require('express').Router();
const passport = require('passport');
const User = require('../models/UserModel');
const {sendEmailVerification} = require('../services/Emailer');
const {isAuthenticated, isParticipant, isAdmin, isDeveloper, verifyTokenFromCookies} = require('../services/auth');
const {createUser} = require('../controllers/UserController')
const jwt = require('jsonwebtoken');


router.get('/register', (req, res, next) => {
    res.render('register', {title: 'Register'});
});

router.get('/login', (req, res, next) => {
  if(verifyTokenFromCookies(req.cookies)) {
    res.redirect('/dashboard');
    return;
  } else {
    res.render('login', {title: 'Login'});
    return;
  }
});

router.get('/logout', function(req, res){
  req.logout();
  delete req.user;
  res.clearCookie('token');
  res.redirect('/login');
});

router.post('/register', (req, res, next) => {
  createUser(req.body)
    .then(result => {
      res.render('login', {title: 'Login', success:'Registration successful, please check your email'});
    })
    .catch(error => {
      res.render('register', {title: 'Register', errors: [error] });
    });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { // passport error
      // res.render('error', {title: 'Error');
      res.send('Uh-oh!')
    }
    else if (!user) { // user does not exist
      res.render('login', {title: 'Login', errors:['Invalid credentials']});
    }
    else {
      if(!user.is_verified) {
        res.send('Please verify your email');
        return;
      }
      const token = user.generateJWT();
      res.cookie('token', token);
      res.redirect('/dashboard');
    }

  })(req, res, next);
});


router.get('/dashboard', isAuthenticated, async(req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.render('dashboard', { title: 'Dashboard', user});
  }
  catch {
    res.status(401).send('UnauthorizedError: Please login again');
  }
});

module.exports = router;
