const router = require('express').Router();
const passport = require('passport');
const User = require('../models/UserModel');
const {sendEmailVerification} = require('../services/Emailer');
const {isAuthenticated, isParticipant, isAdmin, isDeveloper, verifyTokenFromCookies} = require('../services/Auth');
const {createUser} = require('../controllers/UserController')
const jwt = require('jsonwebtoken');


// router.get('/register', (req, res, next) => {
//     res.render('register', {title: 'Register'});
// });

// router.get('/login', (req, res, next) => {
//   if(verifyTokenFromCookies(req.cookies)) {
//     res.redirect('/dashboard');
//     return;
//   } else {
//     res.render('login', {title: 'Login'});
//     return;
//   }
// });

// router.get('/logout', function(req, res){
//   req.logout();
//   delete req.user;
//   res.clearCookie('token');
//   res.redirect('/login');
// });

// router.post('/register', (req, res, next) => {
//   createUser(req.body)
//     .then(result => {
//       res.render('login', {title: 'Login', success:'Registration successful, please check your email'});
//     })
//     .catch(error => {
//       res.render('register', {title: 'Register', errors: [error] });
//     });
// });
router.get('/', async (req, res, next) => {
  if(req.cookies && req.cookies.token) {
    try {
      const token = await jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      res.redirect('/status');
    } catch(e) {
      console.log(e)
      res.clearCookie('token');
      res.render('login', { user: {} })
    }
  }
  else res.render('login', { user: {} })
});

router.post('/', (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { // passport error
      // res.render('error', {title: 'Error');
      res.send('Uh-oh!')
    }
    else if (!user) { // user does not exist
      res.render('login', { error: 'Invalid login credentials', email: req.body.email || '' });
    }
    else {
      // if(!user.is_verified) {
      //   res.send('Please verify your email');
      //   return;
      // }
      const token = user.generateJWT();
      res.cookie('token', token);
      res.redirect('/status');
    }

  })(req, res, next);
});


// router.get('/dashboard', isAuthenticated, async(req, res, next) => {
//   try {
//     const user = await User.findById(req.user._id)
//     res.render('dashboard', { title: 'Dashboard', user});
//   }
//   catch {
//     res.status(401).send('UnauthorizedError: Please login again');
//   }
// });

module.exports = router;
