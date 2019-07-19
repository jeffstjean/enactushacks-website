const mongoose = require('mongoose');
const {validateEmailAddress} = require('../services/validators');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // place for a unique id
  personal: {
    name: { type: String, required: 'User must have a name' },
    email_address: { type: String, required: 'User must have an email', validate: [validateEmailAddress, 'Please enter a valid email address'] },
    already_has_team: { type: boolean, default: false },
    city: { type: String, required: 'User must have a city' },
    university: { type: String, required: 'User must have a university' },
    program: {
      name: { type: String, required: 'User must have a program name' },
      type: { type: String, required: 'User must have a program type' }
    }
  },
  auth: {
    
  },
  application: {
    test_question: { type: String, default: null }
  },
  resume: ,
  team: {
    name: { type: String, default: null },
    members: [ type: mongoose.Schema.Types.ObjectId ],
    hack_name: { type: String, default: null },
    hack_link: { type: String, default: null }
  }
});

module.exports = mongoose.model('User', userSchema);
