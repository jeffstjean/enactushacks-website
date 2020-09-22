const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { SALT_ROUNDS } = require('../config/bcrypt')

const user_schema = mongoose.Schema({
  email: { type: String, required: 'An email is required', unique: true },
  first_name: { type: String, required: 'A first name is required' },
  last_name: { type: String, required: 'A last name is required' },
  gender: { type: String, required: 'A gender is required', enum: ['male', 'female', 'other', 'na'] },
  city: { type: String, required: 'A city is required' },
//   shirt_size: { type: String, required: 'A shirt size is required', enum: ['xs', 's', 'm', 'l', 'xl'] },

//   university: { type: String, required: 'A university is required' },
//   major: { type: String, required: 'A major is required' },
//   program: { type: String, required: 'A program is required' },
//   grad_year: { type: Number, required: 'A graduation year is required' },
//   is_stem: { type: String, required: 'You must specify if your program is STEM, non-STEM or both', enum: ['stem', 'non_stem', 'both'] },
//   resume: { type: String, required: 'A resume is required' },

  password: { type: String, required: 'A password is required' },
  role: { type: String, default: 'participant', enum: ['participant'] },
  is_verified: { type: Boolean, default: false },

  application_status: { type: String, default:'review',
    enum: ['review', 'waitlisted', 'accepted', 'confirmed', 'rejected'] },
  date_application_completed: { type: Date, default: undefined }
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
    console.log(`Comparing ${candidate_password} to ${this.password}`)
    return bcrypt.compareSync(candidate_password, this.password);
  };


module.exports = mongoose.model('User', user_schema);
