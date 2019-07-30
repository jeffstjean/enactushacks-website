const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmailValid, isPasswordValid } = require("../Services/Validation.js");

const userSchema = mongoose.Schema({
  email: { type: String, required: "User must have an email" },
  name: { type: String, required: "User must have a name" },
  shirt_size: { type: String, required: "User must have a shirt size", enum: ['xs', 's', 'm', 'l', 'xl'] },
  city: { type: String, required: "User must have a city" },

  university: { type: String, required: "User must have a university" },
  program_name: { type: String, required: "User must have a program name" },
  program_type: { type: String, required: "User must have a program type" },
  grad_year: { type: String, required: "User must have a graduation year" },
  isStem: { type: Boolean, required: 'User must specify if STEM degree' },
  isNonStem: { type: Boolean, required: 'User must specify if Non-STEM degree' },
  resume: { type: String, required: 'User must include a resume' },

  hash: { type: String, required: 'User must have a password' },
  role: { type: String, default: 'participant', enum: ['participant', 'admin', 'developer'] },
  isVerified: { type: Boolean, default: false },
  last_updated: { type: Date, default: Date.now },
  token: { type: String, default: null },

  github: { type: String, default: null },
  dietary_restrictions: { type: String, default: null },

  application_questions: [],
  application_status: { type: String, default:'incomplete', enum: ['incomplete', 'complete', 'waitlisted', 'accetped', 'confirmed', 'rejected'] },
  application_date_completed: { type: Date, default: null }
}, { versionKey: false } );

userSchema.methods.isValidPassword = function(candidatePassword, storedPassword) {
  return bcrypt.compareSync(candidatePassword, this.hash);
};

userSchema.methods.setPassword = function(candidatePassword, storedPassword) {
  return bcrypt.compareSync(candidatePassword, storedPassword);
};

userSchema.methods.generateJWT = function() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + (process.env.USER_SESSION_DAYS || 7));

  return jwt.sign({
    _id: this._id,
    email: this.email,
    role: this.role,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.JWT_SECRET);
};


module.exports = mongoose.model("User", userSchema);
