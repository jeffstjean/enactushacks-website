const express = require('express');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const mongoose = require('mongoose');
const database = require('./config/mongo.js');

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----- TEMPORARY UNDER CONSTRUCTION PAGE -----
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.render('/public/index.html')
});
// -------------------- END --------------------

// routes
app.use('/user', require('./routes/UserRoute'));
app.use('/settings', require('./routes/SettingsRoute'));

// connect to database then start server
console.log('Connecting to database...');
database.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected!');
    app.listen(process.env.PORT, process.env.HOSTNAME, () => {
      console.log(
        `Server started on http://${process.env.HOSTNAME}:${process.env.PORT}`
      );
    });
  })
  .catch(err => {
    console.log('Error connecting to database');
    console.log(err);
  });
