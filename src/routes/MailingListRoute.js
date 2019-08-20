const router = require('express').Router()
const { addToMailingList, deleteFromMailingList } = require('../services/Emailer')

router.post('/:list', async (req, res, next) => {
  if (req.body.email === undefined) { res.send('Please enter an email...'); return }
  const email = req.body.email
  const list = req.params.list
  try {
    await addToMailingList(list, email)
    res.send(`Added user ${email} to list ${list}`)
  } catch (err) {
    // console.log(err);
    res.status(409).send('Email address already exists')
  }
})

router.delete('/:list', async (req, res, next) => {
  if (req.body.email === undefined) { res.send('Please enter an email...'); return }
  const email = req.body.email
  const list = req.params.list
  try {
    await deleteFromMailingList(list, email)
    res.send(`Deleted user ${email} from list ${list}`)
  } catch (err) {
    res.status(404).send('Email address not found in mailing list')
  }
})

module.exports = router
