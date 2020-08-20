const os = require('os');
const dotenv = require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const database = require('./config/mongo.js');

const port = 5000
const node_env = process.env.NODE_ENV || 'development'
const app = express();

database.connect(process.env.DB_CONNECTION) 
  .then(() => {
    console.log('Connected to database');
  })
  .catch(err => { console.log('Error connecting to database: ' + err); });

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// routes
app.get('/', (req, res, next) => { res.send(`Hello from ${os.hostname()}`) });

app.listen(port, () => {
  console.log(`Server started on port ${port} in mode ${node_env}`);
});
