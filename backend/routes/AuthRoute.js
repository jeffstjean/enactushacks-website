const router = require('express').Router();
const AuthController = require('../controllers/AuthController');

router.post('/login', (req, res, next) => {
  AuthController.login(req, res, next)
    .then(token => {
      res.status(200).json({ token });
    })
    .catch(error => {
      if(res.status === 401) res.status(401).json('Invalid login credentials');
      else res.status(404).json(error);
    });
});

module.exports = router;
