const router = require('express').Router();
const {createUser} = require('../controllers/UserController')


router.get('/', (req, res, next) => {
  console.log(req.flash('success'));
  res.render('register', { title: 'Register' , user });
});

router.post('/', (req, res, next) => {
  createUser(req.body)
    .then(result => {
      req.flash('success', 'Your email has been successfully verified');
      res.redirect('/login');
    })
    .catch(error => {
      res.render('register', { title: 'Register', errors: error, user: req.body });
    });
});

var user = {
  email: undefined,
  first_name: undefined,
  last_name: undefined,
  gender: undefined,
  city: undefined,
  shirt_size: undefined,

  university: undefined,
  major: undefined,
  program: undefined,
  grad_year: undefined,
  is_stem: undefined,
  resume: undefined,
}

module.exports = router;
