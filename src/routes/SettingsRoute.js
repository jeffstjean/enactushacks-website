const router = require('express').Router()
const SettingsController = require('../controllers/SettingsController')

// TODO: Make this admin only
router.get('/', (req, res) => {
  SettingsController.get()
    .then((settings) => {
      res.status(200).json(settings)
    })
    .catch((errorMessages) => {
      res.status(400).json({ error: true, errorMessages: errorMessages })
    })
})

// TODO: Make this admin only
router.post('/', (req, res) => {
  SettingsController.create(req.body)
    .then((settings) => {
      res.status(201).json({ settings })
    })
    .catch((errorMessages) => {
      res.status(400).json({ error: true, errorMessages: errorMessages })
    })
})

// TODO: Make this admin only
router.delete('/', (req, res) => {
  SettingsController.remove()
    .then((result) => {
      res.status(200).json({ result })
    })
    .catch((errorMessages) => {
      res.status(400).json({ error: true, errors: errorMessages })
    })
})

module.exports = router
