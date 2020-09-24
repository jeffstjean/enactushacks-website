const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { SALT_ROUNDS } = require('../config/bcrypt')

const user_schema = mongoose.Schema({
  // account info
  email: { type: String, required: 'An email is required', unique: true },
  password: { type: String, required: 'A password is required' },
  role: { type: String, default: 'participant', enum: ['participant'] },
  is_verified: { type: Boolean, default: false },

  // application info
  application_status: { type: String, default:'under review',
    enum: ['under review', 'waitlisted', 'accepted', 'confirmed', 'rejected'] },
  date_application_completed: { type: Date, default: undefined },
  first_name: { type: String },
  last_name: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other', 'na'] },
  city: { type: String },

  university: { type: String },
  major: { type: String },
  program: { type: String },
  grad_year: { type: Number},
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


module.exports = mongoose.model('User', user_schema);
