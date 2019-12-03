const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

router.get('/', async (req, res) => {
  if(req.cookies && req.cookies.token) {
    try {
      const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const user = await User.findById(token._id, '-hash');
      if(user) res.render('application', { user });
      else {
        res.clearCookie('token')
        res.redirect('/login')
      }
    } catch(e) {
      res.clearCookie('token')
      res.redirect('/login')
    }
  }
  else {
    res.redirect('/login')
  }
});

module.exports = router;
