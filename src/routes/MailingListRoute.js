const router = require('express').Router()
const { addToMailingList, deleteFromMailingList } = require('../services/Emailer')

router.get('/', (req, res, next) => {
  console.log('add')
  res.render('newsletter', { title: 'Newsletter' })
})

router.get('/delete', (req, res, next) => {
  console.log('Delete')
  res.render('newsletter_delete', { title: 'Remove from Newsletter :(' })
})

router.post('/', async (req, res, next) => {
  if (req.body.email === undefined) { res.send('Please enter an email...'); return }
  const email = req.body.email
  const list = 'eh1'
  try {
    await addToMailingList(list, email)
    res.render('newsletter', { title: 'Newsletter', added_user: email })
  } catch (err) {
    res.render('newsletter', { title: 'Newsletter - Error', error_user: email })
  }
})

router.post('/delete', async (req, res, next) => {
  if (req.body.email === undefined) { res.send('Please enter an email...'); return }
  const email = req.body.email
  const list = 'eh1'
  try {
    await deleteFromMailingList(list, email)
    res.render('newsletter_delete', { title: 'Newsletter :(', removed_user: email })
  } catch (err) {
    res.render('newsletter_delete', { title: 'Newsletter - Error', error_user: email })
  }
})

module.exports = router
