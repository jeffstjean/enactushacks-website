const passport = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const User = require('../models/UserModel');
const UserController = require('../controllers/UserController');

module.exports.init = function() {
  passport.use(new LocalStrategy({ usernameField: 'email' },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      // Return if password is wrong
      if (!user.isValidPassword(password)) {
        return done(null, false, { message: 'Password is wrong' });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));
};
