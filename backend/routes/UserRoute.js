const router = require('express').Router();
const UserController = require('../controllers/UserController');

// TODO: Make this admin only
router.get('/', (req, res) => {
  UserController.getAll(req.body, '-personal.github -personal.dietary_restrictions -personal.qr -application.questions -resume')
    .then((users) => {
    res.status(200).json( { users } );
  })
  .catch((errorMessages) => {
    res.status(400).json( { error: true, errorMessages } );
  });
});

router.post('/', (req, res) => {
  UserController.create(req.body)
    .then((created_user_id) => {
    res.status(201).json( { created_user_id } );
  })
  .catch((errorMessages) => {
    res.status(400).json( { error: true, errorMessages: errorMessages } );
  });
});

// TODO: Make this protected - user can only see itself, admin can see all
router.get('/:id', (req, res) => {
  UserController.getByID(req.params.id)
    .then((user) => {
      res.status(200).json( { user } );
    })
    .catch((errorMessages) => {
      res.status(404).json( { error: true, errors: errorMessages } );
    });
});

// TODO: Make this protected - user can only delete itself, admin can delete all
router.delete('/:id', (req, res) => {
  UserController.remove(req.params.id)
    .then((deleted_user_id) => {
      res.status(200).json( { deleted_user_id } );
    })
    .catch((errorMessages) => {
      res.status(400).json( { error: true, errors: errorMessages } );
    });
});

// TODO: Make this protected - user can only update itself, admin can update all
router.patch('/:id', (req, res) => {
  UserController.update(req.params.id, req.body)
    .then((updated_user_id) => {
      res.status(200).json( { updated_user_id } );
    })
    .catch((errorMessages) => {
      res.status(404).json( { error: true, errors: errorMessages } );
    });
});

module.exports = router;
