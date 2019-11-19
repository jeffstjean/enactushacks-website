const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

module.exports.isAuthenticated = (req, res, next) => {
  const decoded = verifyTokenFromCookies(req.cookies);
  if(decoded) {
    req.user = decoded;
    next();
    return;
  }
  else {
    next({name: 'UnauthorizedError', status: 401, message: 'You must be logged in to view this page'});
    return;
  }
};

module.exports.isParticipant = (req, res, next) => {
  const decoded = verifyTokenFromCookies(req.cookies);
  console.log(decoded);
  if(decoded && decoded.role === 'participant' || decoded.role === 'admin' || decoded.role === 'developer') {
    req.user = decoded;
    next();
    return;
  }
  else {
    res.status(401).send('cant be here');
    return;
  }
};

module.exports.isAdmin = (req, res, next) => {
  const decoded = verifyTokenFromCookies(req.cookies);
  if(decoded && decoded.role === 'admin' || decoded.role === 'developer') {
    req.user = decoded;
    next();
    return;
  }
  else {
    res.status(401).send('cant be here');
    return;
  }
};

module.exports.isDeveloper = (req, res, next) => {
  const decoded = verifyTokenFromCookies(req.cookies);
  if(decoded && decoded.role === 'developer') {
    req.user = decoded;
    next();
    return;
  }
  else {
    res.status(401).send('cant be here');
    return;
  }
};

const verifyTokenFromCookies = (cookies) => {
  if(!cookies.token) return null;
  try {
    console.log('checking token');
    var old_token = jwt.verify(cookies.token, process.env.JWT_SECRET);
    return old_token;
  }
  catch { return null; }
};

module.exports.verifyTokenFromCookies = verifyTokenFromCookies
