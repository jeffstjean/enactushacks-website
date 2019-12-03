const router = require('express').Router();
const UserController = require('../controllers/UserController');
const {isAuthenticated} = require('../services/Auth')
const jwt = require('jsonwebtoken');

// router.get('/', (req, res) => {
//   // if(req.payload.role === 'participant') return res.status(401).send();
//   console.log(req.query);
//   UserController.getByQuery(req.query, 'role application_status _id name email city link')
//     .then((users) => {
//       res.status(200).json( { users: users } );
//   })
//   .catch((errorMessages) => {
//     res.status(400).json( { error: true, errorMessages } );
//   });
// });

router.get('/', async (req, res) => {
  if(req.cookies && req.cookies.token) {
    try {
      const token = await jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      res.redirect('/status');
    } catch(e) {
      console.log(e)
      res.clearCookie('token');
      res.render('apply', { user: {} })
    }
  }
  else res.render('apply', { user: {} })
});

router.post('/', (req, res) => {
  UserController.createUser(req.body)
    .then((user) => {
    res.redirect('/login');
  })
  .catch((errorMessages) => {
    delete req.body.password
    delete req.body.password_match
    console.log(req.body.question1);
    if(req.body.gender) {
      if(req.body.gender === 'female') req.body.female = true;
      else if(req.body.gender === 'male') req.body.male = true;
      else if(req.body.gender === 'other') req.body.other = true;
      else if(req.body.gender === 'na') req.body.na = true;
    }
    if(req.body.shirt_size) {
      if(req.body.shirt_size === 'xs') req.body.xs = true;
      else if(req.body.shirt_size === 's') req.body.s = true;
      else if(req.body.shirt_size === 'm') req.body.m = true;
      else if(req.body.shirt_size === 'l') req.body.l = true;
      else if(req.body.shirt_size === 'xl') req.body.xl = true;
    }
    if(req.body.is_stem) {
      if(req.body.is_stem === 'stem') req.body.stem = true;
      else if(req.body.is_stem === 'non_stem') req.body.non_stem = true;
      else if(req.body.is_stem === 'both') req.body.both = true;
    }
    console.log(req.body)
    res.render('apply', { error: true, errors: errorMessages, user: req.body } );
  });
});


// router.get('/me', isAuthenticated, (req, res) => {
//   // if a participant, check to see if they are requesting their own profile
//   UserController.getByID(req.payload._id)
//     .then((user) => {
//       res.status(200).json( { user } );
//     })
//     .catch((errorMessages) => {
//       res.status(404).json( { error: true, errors: errorMessages } );
//     });
// });

// router.get('/:id', isAuthenticated, (req, res) => {
//   // if a participant, check to see if they are requesting their own profile
//   if(req.payload.role === 'participant') return res.status(401).send();
//   UserController.getByID(req.params.id)
//     .then((user) => {
//       res.status(200).json( { user } );
//     })
//     .catch((errorMessages) => {
//       res.status(404).json( { error: true, errors: errorMessages } );
//     });
// });

// router.delete('/:id', (req, res) => {
//   var id = req.params.id;
//   if(req.payload.role === 'participant' && req.payload._id !== req.params.id) return res.status(401).send();
//   UserController.remove(req.params.id)
//     .then((deleted_user_id) => {
//       res.status(200).json( { deleted_user_id } );
//     })
//     .catch((errorMessages) => {
//       res.status(400).json( { error: true, errors: errorMessages } );
//     });
// });

// router.patch('/:id', (req, res) => {
//   console.log(req.body);
//   if(req.payload.role === 'participant' && req.payload._id !== req.params.id) return res.status(401).send();
//   UserController.update(req.params.id, req.body)
//     .then((updated_user_id) => {
//       res.status(200).json( { updated_user_id } );
//     })
//     .catch((errorMessages) => {
//       res.status(404).json( { error: true, errors: errorMessages } );
//     });
// });

module.exports = router;
