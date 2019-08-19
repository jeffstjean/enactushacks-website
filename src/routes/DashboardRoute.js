const router = require('express').Router();
const User = require('../models/UserModel');
const {isAuthenticated} = require('../services/Auth');

router.get('/', isAuthenticated, async(req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.render('dashboard', { title: 'Dashboard', user});
  }
  catch {
    res.status(401).send('UnauthorizedError: Please login again');
  }
});

module.exports = router;
