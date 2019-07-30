const router = require('express').Router();
const UserController = require('../controllers/UserController');
const {auth} = require('../controllers/AuthController')

router.get('/', auth, (req, res) => {
  if(req.payload.role === 'participant') return res.status(401).send();
  console.log(req.query);
  UserController.getByQuery(req.query, 'role application_status _id name email city link')
    .then((users) => {
      res.status(200).json( { users: users } );
  })
  .catch((errorMessages) => {
    res.status(400).json( { error: true, errorMessages } );
  });
});

router.post('/', (req, res) => {
  UserController.create(req.body)
    .then((user) => {
    res.status(201).json(user);
  })
  .catch((errorMessages) => {
    res.status(400).json( { error: true, errorMessages: errorMessages } );
  });
});


router.get('/me', auth, (req, res) => {
  // if a participant, check to see if they are requesting their own profile
  UserController.getByID(req.payload._id)
    .then((user) => {
      res.status(200).json( { user } );
    })
    .catch((errorMessages) => {
      res.status(404).json( { error: true, errors: errorMessages } );
    });
});

router.get('/:id', auth, (req, res) => {
  // if a participant, check to see if they are requesting their own profile
  if(req.payload.role === 'participant') return res.status(401).send();
  UserController.getByID(req.params.id)
    .then((user) => {
      res.status(200).json( { user } );
    })
    .catch((errorMessages) => {
      res.status(404).json( { error: true, errors: errorMessages } );
    });
});

router.delete('/:id', (req, res) => {
  var id = req.params.id;
  if(req.payload.role === 'participant' && req.payload._id !== req.params.id) return res.status(401).send();
  UserController.remove(req.params.id)
    .then((deleted_user_id) => {
      res.status(200).json( { deleted_user_id } );
    })
    .catch((errorMessages) => {
      res.status(400).json( { error: true, errors: errorMessages } );
    });
});

router.patch('/:id', (req, res) => {
  console.log(req.body);
  if(req.payload.role === 'participant' && req.payload._id !== req.params.id) return res.status(401).send();
  UserController.update(req.params.id, req.body)
    .then((updated_user_id) => {
      res.status(200).json( { updated_user_id } );
    })
    .catch((errorMessages) => {
      res.status(404).json( { error: true, errors: errorMessages } );
    });
});

module.exports = router;
