const mailgun = require('mailgun-js')
const ejs = require('ejs')
const fs = require('fs')
const mg = mailgun({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN })

module.exports.sendEmailVerification = (recipient, token) => {
  const file = fs.readFileSync('./emails/verifyEmailTemplate.ejs', 'utf8')
  const email = ejs.render(file, { link: 'http://localhost:3000/verify/token/' + token })
  const data = {
    from: 'EnactusHacks <info@enactushacks.com>',
    to: recipient,
    subject: 'Please verify your email',
    html: email
  }
  mg.messages().send(data, function (error, body) {
    if (error) console.log(error)
  })
}

module.exports.sendPasswordReset = (recipient, token) => {
  console.log('sending email to ' + recipient + ' with a password token of ' + token)
  const file = fs.readFileSync('./emails/verifyEmailTemplate.ejs', 'utf8')
  const email = ejs.render(file, { link: 'http://localhost:3000/forgot/' + token })
  const data = {
    from: 'EnactusHacks <info@enactushacks.com>',
    to: recipient,
    subject: 'Please verify your email',
    html: email
  }
  mg.messages().send(data, function (error, body) {
    if (error) console.log(error)
  })
}

module.exports.addToMailingList = (listName, email) => {
  return new Promise((resolve, reject) => {
    const list = mg.lists(listName + '@' + process.env.MAILGUN_DOMAIN)
    const user = { subscribed: true, address: email }
    list.members().create(user, function (err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

module.exports.deleteFromMailingList = (listName, email) => {
  return new Promise((resolve, reject) => {
    const list = mg.lists(listName + '@' + process.env.MAILGUN_DOMAIN)
    list.members(email).delete(function (err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

module.exports.sendUserCreationConfirmation = (recipient) => {
  const file = fs.readFileSync('./emails/userCreationTemplate.ejs', 'utf8')
  const email = ejs.render(file)
  const data = {
    from: 'EnactusHacks <info@enactushacks.com>',
    to: recipient,
    subject: 'Thank you for applying to EnactusHacks!',
    html: email
  }
  mg.messages().send(data, function (error, body) {
    if (error) console.log(error)
  })
}
