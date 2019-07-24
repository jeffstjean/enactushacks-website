const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');

// allows access to .env file
dotenv.config();

// mongo


const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));

// routes

app.listen(process.env.PORT, process.env.HOSTNAME, () => {
  console.log('Server running at http://' + process.env.HOSTNAME + ':' + process.env.PORT);
);
