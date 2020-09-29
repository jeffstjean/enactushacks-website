const fs = require('fs')

const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const ejs = require('ejs')
const crypto = require('crypto');

const { SALT_ROUNDS } = require('../config/bcrypt')
const { hostname } = require('../config/config')
const { mg } = require('../config/mailgun')

const VERIFICATION_EXPIRATION_HOURS = 2

const user_schema = mongoose.Schema({
  // account info
  email: { type: String, required: 'An email is required', unique: true },
  password: { type: String, required: 'A password is required' },
  role: { type: String, default: 'participant', enum: ['participant'] },
  is_verified: { type: Boolean, default: false },
  token: { type: String, default: undefined },
  token_expiration: { type: Date, default: undefined },

  // application info
  application_status: { type: String, default:'unverified',
    enum: ['unverified', 'incomplete', 'under review', 'waitlisted', 'accepted', 'confirmed', 'rejected'] },
  date_application_completed: { type: Date, default: undefined },
  first_name: { type: String },
  last_name: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other', 'na'] },
  city: { type: String },

  university: { type: String },
  major: { type: String },
  program: { type: String },
  grad_year: { type: Date },
  is_stem: { type: String, enum: ['stem', 'non_stem', 'both'] },
  resume: { type: String },

  // shipping info
  ship_name: { type: String },
  ship_address: { type: String },
  ship_apartment: { type: String },
  ship_city: { type: String },
  ship_country: { type: String },
  ship_province: { type: String },
  ship_postal: { type: String },
}, { versionKey: false } );

user_schema.pre('save', function(next) {
    let user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, SALT_ROUNDS).then(hash => {
        user.password = hash;
        next();
    });
})

user_schema.methods.is_valid_password = function(candidate_password) {
  return bcrypt.compareSync(candidate_password, this.password);
};

user_schema.methods.send_verification_email = function() {
  const user = this;
  if(user.application_status !== 'unverified') return;

  const token = crypto.randomBytes(16).toString('hex');
  user.token = token;
  user.token_expiration = new Date(+new Date() + VERIFICATION_EXPIRATION_HOURS*60*60*1000);
  user.save();

  const email = ejs.render(fs.readFileSync('./emails/verify_email.ejs', 'utf8'), { link: `http://${hostname}/verify/${token}`, expiration: VERIFICATION_EXPIRATION_HOURS })
  const data = { from: `EnactusHacks <info@enactushacks.com>`, to: user.email, subject: 'Please verify your email', html: email }
  mg.messages().send(data, function (error, body) {
    if(error) console.log(error)
    else console.log(`Verification email sent to ${user.email}`)
  })
};


module.exports = mongoose.model('User', user_schema);
