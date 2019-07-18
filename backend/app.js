const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// allows access to .env file
dotenv.config();

const app = express();

// configure app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(process.env.PORT, process.env.HOSTNAME, () => {
  console.log('Server running at http://' + process.env.HOSTNAME + ':' + process.env.PORT);
});
