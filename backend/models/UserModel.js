const mongoose = require("mongoose");
const { isEmailValid, isPasswordValid } = require("../Services/Validation.js");

const userSchema = mongoose.Schema({
  personal: {
    name: { type: String, required: "User must have a name" },
    email_address: { type: String, required: "User must have an email" },
    github: { type: String, default: null },
    city: { type: String, required: "User must have a city" },
    university: { type: String, required: "User must have a university" },
    program: {
      name: { type: String, required: "User must have a program name" },
      type: { type: String, required: "User must have a program type" },
      grad_year: { type: String, required: "User must have a graduation year" },
      isStem: { type: Boolean, required: 'User must specify STEM degree or not' }
    },
    dietary_restrictions: { type: String, default: null },
    shirt_size: { type: String, required: "User must have a shirt size", enum: ['xs', 's', 'm', 'l', 'sl'] },
    qr: { type: String, default: null }
  },
  auth: {
    hash: { type: String, default: null, select: false },
    salt: { type: String, default: null, select: false },
    isVerified: { type: Boolean, default: false, select: false },
    last_updated: { type: Date, default: Date.now, select: false },
    token: { type: String, default: null, select: false }
  },
  application: {
    questions: [],
    status: { type: String, default:'incomplete', enum: ['incomplete', 'complete', 'waitlisted', 'accetped', 'confirmed', 'rejected'] },
    date_completed: { type: Date, default: null }
  },
  resume: { type: String, required: 'User must include a resume' }
}, { versionKey: false } );

userSchema.methods.setPassword = (string) => {
  // generate hash
  // generate salt
  // save to database
}

module.exports = mongoose.model("User", userSchema);
