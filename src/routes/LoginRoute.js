const router = require('express').Router();
const passport = require('passport');
const {verifyTokenFromCookies} = require('../services/Auth');

router.get('/', (req, res, next) => {
  if(verifyTokenFromCookies(req.cookies)) {
    res.redirect('/dashboard');
    return;
  } else {
    res.render('login', { title: 'Login', success: req.flash('success') });
    return;
  }
});

router.post('/', (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { // passport error
      console.log('Passport error');
      // res.render('error', {title: 'Error');
      res.send('Uh-oh!')
    }
    else if (!user) { // user does not exist
      console.log('User does not exist');
      res.render('login', {title: 'Login', errors:['Invalid credentials'] });
    }
    else {
      if(!user.is_verified) {
        console.log('User is not verified');
        res.send('Please verify your email');
        return;
      }
      console.log('Ok. Generating token...');
      const token = user.generateJWT();
      res.cookie('token', token);
      res.redirect('/dashboard');
    }

  })(req, res, next);
});

router.get('/', function(req, res){
  req.logout();
  delete req.user;
  res.clearCookie('token');
  res.redirect('/login');
});


module.exports = router;
