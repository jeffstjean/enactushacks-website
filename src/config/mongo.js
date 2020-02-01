const mongoose = require("mongoose");

const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
};


const connect = uri => {
  // settings for depreciated features
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);

  return mongoose.connect(uri, options);
};

module.exports = {
  connect,
  mongoose
};
