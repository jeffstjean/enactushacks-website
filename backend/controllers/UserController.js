const User = require('../models/UserModel');

// --- CREATE A NEW USER ---
const create = (reqData) => {
  return new Promise((resolve, reject) => {
    User.findOne( { email_address: reqData.email_address } )
      .then(user => {
        if(user) reject('A user with this email already exists');
        else { // user doesn't exist already -> create new user
          errorMessages = [];
          if(reqData.password !== reqData.passwordMatch) errorMessages.push('Passwords must match');
          const newUser = new User(reqData);
          newUser.save()
            .then(user => {
              if(errorMessages.length > 0) reject(errorMessages);
              else resolve( user._id );
            })
            .catch(error => {
              getCleanValidationErrorMessage(error, errorMessages);
              reject(errorMessages);
            });
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

// --- GET ALL USERS ---
const getAll = (id, options) => {
  return new Promise((resolve, reject) => {
    User.find({}, options)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject('Could not get users');
      });
  });
}


// --- GET A USER BY ID ---
const getByID = (id) => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then(user => {
        if(!user) reject('User does not exist');
        else resolve(user);
      })
      .catch(error => {
        reject('User does not exist');
      });
  });
}

// --- GET A USER BY FIELD ---
const getByField = (query) => {
  return new Promise((resolve, reject) => {
    User.findOne(query)
      .then(user => {
        if(!user) reject('User does not exist');
        else resolve(user);
      })
      .catch(error => {
        reject('User does not exist');
      });
  });
}

// --- DELETE A USER BY ID ---
const remove = (id) => {
  return new Promise((resolve, reject) => {
    User.findOneAndDelete( { _id: id } )
      .then(deleted_user => {
        if(!deleted_user) reject('User does not exist');
        else resolve(deleted_user._id);
      })
      .catch(error => {
        reject('User does not exist');
      });
  });
}

// --- UPDATE A USER BY ID ---
const update = (id, reqData) => {
  return new Promise((resolve, reject) => {
    // need to check if request has anything auth related content
    // if there is, reject the response - auth updates only though model
    let requestForAuthUpdate = false
    Object.keys(reqData).forEach(key => { if(key.indexOf('auth') !== -1) requestForAuthUpdate = true });

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
}

module.exports = {
  create,
  getByID,
  getAll,
  remove,
  update,
  getByField
}
