const mailgun = require('mailgun-js')
const { MAILGUN_KEY, MAILGUN_DOMAIN } = require('../config/mailgun')
const mg = mailgun({ apiKey: MAILGUN_KEY, domain: MAILGUN_DOMAIN})

module.exports.add_to_mailing_list = (list_name, email) => {
    return new Promise((resolve, reject) => {
      const list = mg.lists(list_name + '@' + MAILGUN_DOMAIN)
      const user = { subscribed: true, address: email }
      list.members().create(user, function (err, data) {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }