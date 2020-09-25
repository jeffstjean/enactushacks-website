const mailgun = require('mailgun-js')
const mg = mailgun({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN })

module.exports = {
    MAILGUN_KEY: process.env.MAILGUN_KEY,
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    mg: mg
};
