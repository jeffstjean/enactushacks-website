const router = require('express').Router();
const Token = require('../models/PasswordTokenModel');
const User = require('../models/UserModel');
const {sendPasswordReset} = require('../services/Emailer');

router.get('/', (req, res, next) => {
  res.render('password_recovery');
});

router.get('/:token', (req, res, next) => {
  // find the token and delete it - one time use
  console.log('finding token ' + req.params.token + '...');
  Token.findOneAndDelete({token: req.params.token})
  .then(token => {
    console.log('search done.');
    if(token) {
      console.log('found token.');
      if(token.expiry < new Date()) res.send('expired token');
      // if we find a valid token then find the user attached to that token
      console.log('finding user ' + token.user_id + '...');
      User.findById(token.user_id)
        .then(user => {
          if(user) {
            res.send('Found user and token...display password reset form');
          }
        })
        .catch(error => { res.send('Error getting user') });
    } else { res.send('invalid token'); }
  })
  .catch(error => { console.log('ERROR'); res.json(error); })
});


router.post('/', async(req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if(user == null) {
      res.render('password_recovery', { msg: 'If a user with that email exists, more instructions have been sent to their inbox' });
      return;
    }
    const token = await Token.findOne({user_id: user._id});
    // if the token exists: check if timeout has been waited for and delete the token
    if(token) {
      if(new Date() - token._id.getTimestamp() < 5 * 60 * 1000) {
        res.send('Please wait a little longer before requesting another password reset');
        return;
      }
      await Token.deleteOne({_id: token._id});
    }

    // create a new token
    var newPasswordToken = new Token({user_id: user._id});
    newPasswordToken = await newPasswordToken.save();
    newPasswordToken = newPasswordToken.token;

    // send er out!
    sendPasswordReset(user.email, newPasswordToken);
    res.json(newPasswordToken);
  }
  catch (e) {
    console.log(e);
  }
});

module.exports = router;
