const router = require('express').Router();
const UserController = require('../controllers/UserController');

router.get('/', (req, res) => {
  UserController.getAll(req.body, '-personal.github -personal.dietary_restrictions -personal.qr -application.questions -resume')
    .then((users) => {
    res.status(200).json( { users } );
  })
  .catch((errorMessages) => {
    res.status(400).json( { error: true, errorMessages } );
  });
});

router.post('/', async (req, res) => {
  UserController.create(req.body)
    .then((created_user_id) => {
    res.status(201).json( { created_user_id } );
  })
  .catch((errorMessages) => {
    res.status(400).json( { error: true, errorMessages: errorMessages } );
  });
});

router.get('/:id', (req, res) => {
  UserController.getByID(req.params.id)
    .then((user) => {
      res.status(200).json( { user } );
    })
    .catch((errorMessages) => {
      res.status(404).json( { error: true, errors: errorMessages } );
    });
});

router.delete('/:id', (req, res) => {
  UserController.remove(req.params.id)
    .then((deleted_user_id) => {
      res.status(200).json( { deleted_user_id } );
    })
    .catch((errorMessages) => {
      res.status(400).json( { error: true, errors: errorMessages } );
    });
});

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
