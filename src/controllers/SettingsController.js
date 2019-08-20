const Settings = require('../models/SettingsModel')

// --- CREATE SETTINGS ---
const create = (reqData) => {
  return new Promise((resolve, reject) => {
    console.log(reqData)
    Settings.findOne({})
      .then(result => {
        var errorMessages = []
        if (result) reject(new Error('Settings document already exists'))
        else {
          const newSettings = new Settings(reqData)
          newSettings.save()
            .then(settings => {
              resolve(settings)
            })
            .catch(error => {
              getCleanValidationErrorMessage(error, errorMessages)
              reject(errorMessages)
            })
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

// --- GET SETTINGS ---
const get = () => {
  return new Promise((resolve, reject) => {
    Settings.findOne({}, '-_id')
      .then(result => {
        if (result) resolve(result)
        else reject(new Error('No settings exist yet - create one using POST'))
      })
      .catch(() => {
        reject(new Error('Could not get users'))
      })
  })
}

// --- UPDATE SETTINGS ---
// const update = (id, reqData) => {
// return new Promise((resolve, reject) => {
//     Settings.findOneAndUpdate( { _id: id }, { "$set":  reqData}, { new: true, runValidators: true } )
//       .then(updatedUser => {
//         console.log('success');
//         if(!updatedUser) reject('User does not exist');
//         else resolve(updatedUser._id);
//       })
//       .catch(error => {
//         console.log('error');
//         getCleanValidationErrorMessage(error, errorMessages);
//         reject(errorMessages);
//       });
// });
// }

// --- DELETE SETTINGS ---
const remove = () => {
  return new Promise((resolve, reject) => {
    Settings.deleteMany({})
      .then(Settings => {
        resolve('Deleted settings')
      })
      .catch(() => {
        reject(new Error('Could not delete settings'))
      })
  })
}

const getCleanValidationErrorMessage = (error, messages) => {
  if (error) {
    if (error.name === 'ValidationError') {
      for (var field in error.errors) {
        messages.push((error.errors[field].message))
      }
    }
  }
}

module.exports = {
  create,
  get,
  remove
}
