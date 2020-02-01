const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isEmailValid, isPasswordValid, deleteEmpty, isResumeValid } = require("../services/Validation.js");

const userSchema = mongoose.Schema({
  email: { type: String, required: "An email is required", validate: isEmailValid },//
  first_name: { type: String, required: "A first name is required" },//
  last_name: { type: String, required: "A last name is required" },//
  gender: { type: String, required: "A gender is required", enum: ['male', 'female', 'other', 'na'] },//
  city: { type: String, required: "A city is required" },//
  shirt_size: { type: String, required: "A shirt size is required", enum: ['xs', 's', 'm', 'l', 'xl'] },//

  university: { type: String, required: "A university is required" },//
  major: { type: String, required: "A major is required" },//
  program: { type: String, required: "A program is required" },//
  grad_year: { type: String, required: "A graduation year is required" },//
  is_stem: { type: String, required: 'You must specify if your program is STEM, non-STEM or both',
    enum: ['stem', 'non_stem', 'both'] },//
  resume: { type: String, required: 'A resume is required', validate: isResumeValid },//

  hash: { type: String, required: 'A password is required' },
  role: { type: String, default: 'participant', enum: ['participant', 'admin', 'developer'] },
  is_verified: { type: Boolean, default: false },

  github: { type: String, set: deleteEmpty },
  dietary_restrictions: { type: String, set: deleteEmpty },

  question1: { type: String, required: "You must complete the first application question" },
  question2: { type: String, required: "You must complete the second application question" },
  question3: { type: String, required: "You must complete the third application question" },
  application_status: { type: String, default:'pending review',
    enum: ['pending review', 'waitlisted', 'accepted', 'confirmed', 'rejected'] },
  application_date_completed: { type: Date, default: undefined }
}, { versionKey: false } );

userSchema.methods.isValidPassword = function(candidatePassword, storedPassword) {
  return bcrypt.compareSync(candidatePassword, this.hash);
};

userSchema.methods.setPassword = function(candidatePassword, storedPassword) {
  return bcrypt.compareSync(candidatePassword, storedPassword);
};

userSchema.methods.generateJWT = function() {
  const expiry = process.env.JWT_TOKEN_LIFE || '60m';
  return jwt.sign({
    _id: this._id,
    email: this.email,
    role: this.role
  }, process.env.JWT_SECRET, {expiresIn: expiry });
};




module.exports = mongoose.model("User", userSchema);
