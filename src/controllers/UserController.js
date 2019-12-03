const User = require('../models/UserModel');
const VerifyToken = require('../models/VerifyTokenModel');
const bcrypt = require('bcryptjs');
const {sendUserCreationConfirmation} = require('../services/Emailer');

// --- CREATE A NEW USER ---
const createUser = (reqData) => {
  return new Promise(async (resolve, reject) => {
    // first check to make sure the password data has been sent and both equal each other
    if(typeof reqData.password === undefined || typeof reqData.password_match === undefined || reqData.password !== reqData.password_match) reject(['Passwords must match']);
    else {
      try {
        await userDoesNotExist(reqData.email); // check if the user already exists
        const hash = await getHashedPassword(reqData.password); // hash the password
        delete reqData.password;
        delete reqData.password_match;
        reqData.hash = hash; // add it to the request object
        const newUser = new User(reqData); // create the new user
        try {
          const savedUser = await newUser.save(); // attempt to save - run validations
          const jwtToken = savedUser.generateJWT();
          sendUserCreationConfirmation(savedUser.email);
          resolve({token: jwtToken, _id: savedUser._id});
        }
        catch(mongoose_errors) {
          // mongoose threw some validation errors
          // we don't wanna just send these all out looking ugly so we clean them up first
          console.log(mongoose_errors)
          var errorMessages = [];
          getCleanValidationErrorMessage(mongoose_errors, errorMessages);
          reject(errorMessages);
        }
      }
      catch (error) {
        // the user already exists or the passwords were not defined or did not match
        // either way, send em back!
        console.log(error)
        reject([error])
      }
    }
  });
}

// resolves if a user with that email cannot be found
const userDoesNotExist = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({'email': email})
      .then(user => {
        if(!user) resolve();
        else reject('A user with that email address already exists');
      })
      .catch(error => {
        reject();
      });
  });
}

// resolves with a hashed password
const getHashedPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, function(err, hash) {
      if(err) reject(err)
      else resolve(hash);
    });
  });
}

// --- UPDATE A USER BY ID ---
const updateUser = (id, reqData) => {
  return new Promise((resolve, reject) => {
    if(requestForAuthUpdate) reject('Wrong method for auth update');
    else {
      User.findOneAndUpdate( { _id: id }, { "$set":  reqData}, { new: true, runValidators: true } )
        .then(updatedUser => {
          if(!updatedUser) reject('User does not exist');
          else resolve(updatedUser._id);
        })
        .catch(error => {
          getCleanValidationErrorMessage(error, errorMessages);
          reject(errorMessages);
        });
    }
  });
}

const getCleanValidationErrorMessage = (error, messages) => {
  if (error) {
    if (error.name == 'ValidationError') {
      for (field in error.errors) {
        messages.push((error.errors[field].message));
      }
    }
  }
};

module.exports = {
  createUser,
  updateUser
}
