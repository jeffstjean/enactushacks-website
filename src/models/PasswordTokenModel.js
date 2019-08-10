const mongoose = require("mongoose");
const crypto = require('crypto');

const passwordTokenSchema = mongoose.Schema({
  token: { type: String },
  user_id: { type: String, required: 'Must provide a user_id'},
  expiry: { type: Date }
}, { versionKey: false } );

passwordTokenSchema.pre('save', function(next) {
  var expiry = new Date();
  expiry.setHours( expiry.getHours() + 2);
  this.expiry = expiry;

  const token = crypto.randomBytes(16).toString('hex');
  this.token = token;

  next();
});

module.exports = mongoose.model('PasswordToken', passwordTokenSchema);
