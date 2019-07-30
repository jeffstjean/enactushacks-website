const passport = require('passport');
const jwt = require('express-jwt');

const login = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', function(err, user, info) {
      if (err) { // passport error
        reject( { status: 404, error: 'passport error' } );
        return;
      }

      if (!user) { // user does not exist
        reject({ status: 401, error: 'invalid login credentials' } );
        return;
      }
      var token = user.generateJWT();
      resolve({ status: 200, token } );

    })(req, res, next);
  });
}

const auth = jwt({ secret: process.env.JWT_SECRET, userProperty: 'payload' });

module.exports = {
  login,
  auth
}
