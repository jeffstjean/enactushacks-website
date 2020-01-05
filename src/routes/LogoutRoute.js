const router = require('express').Router();
const passport = require('passport');
const User = require('../models/UserModel');
const {sendEmailVerification} = require('../services/Emailer');
const {isAuthenticated, isParticipant, isAdmin, isDeveloper, verifyTokenFromCookies} = require('../services/Auth');
const {createUser} = require('../controllers/UserController')
const jwt = require('jsonwebtoken');

router.get('/', async (req, res, next) => {
  if(req.cookies && req.cookies.token) {
    console.log('logging user out')
    res.clearCookie('token');
    res.redirect('/')
  }
});

module.exports = router;
