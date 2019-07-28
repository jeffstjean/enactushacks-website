const mongoose = require("mongoose");


const connect = uri => {
  // settings for depreciated features
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  return mongoose.connect(uri, { useNewUrlParser: true });
};

module.exports = {
  connect
};
