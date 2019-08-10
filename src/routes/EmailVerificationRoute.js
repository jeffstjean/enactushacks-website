const router = require('express').Router();
const Token = require('../models/VerifyTokenModel');
const User = require('../models/UserModel');
const {sendEmailVerification} = require('../services/Emailer');

router.get('/token/:token', (req, res, next) => {
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
            console.log('found user.');
            // if that user exists then set them to verified
            user.is_verified = true;
            console.log('saving user...');
            user.save()
              .then(savedUser => {
                console.log('saved user.');
                res.send('Success! Please login');
              })
              .catch(error => { res.send('Error saving user') });
          }
        })
        .catch(error => { res.send('Error getting user') });
    } else { res.send('invalid token'); }
  })
  .catch(error => { console.log('ERROR'); res.json(error); })
});

router.get('/resend', (req, res, next) => {
  res.send('RESEND')
});

router.post('/resend', async(req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});
    // if the user is already verified, return
    if(user.is_verified) {
      res.send('User is already verified!');
      return;
    }
    const token = await Token.findOne({user_id: user._id});
    // if the token exists: check if timeout has been waited for and delete the token
    if(token) {
      if(new Date() - token._id.getTimestamp() < 2 * 60 * 1000) {
        res.send('Please wait a little longer before requesting another verification email');
        return;
      }
      await Token.deleteOne({_id: token._id});
    }
    
    // create a new token
    var newEmailToken = new Token({user_id: user._id});
    newEmailToken = await newEmailToken.save();
    newEmailToken = newEmailToken.token;

    // send er out!
    sendEmailVerification(user.email, newEmailToken);
    res.json(newEmailToken);
  }
  catch (e) {
    console.log(e);
  }
});

module.exports = router;
