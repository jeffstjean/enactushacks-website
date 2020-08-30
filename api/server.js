const path = require('path');

const dotenv = require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const favicon = require('serve-favicon');

const database = require('./config/mongo.js');

// app configuration
const port = 5000
const node_env = process.env.NODE_ENV || 'development'
const app = express();

// middlewares
app.use(express.static('public'));
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
if(node_env === 'production') app.use(morgan('combined'));
else app.use(morgan('dev'));

// ejs registration
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// routes
app.get('/', (req, res, next) => { res.render('index') });
app.use('/mail', require('./routes/MailingListRoute'));
app.use((req, res, next) => {
  if(res.statusCode === 404) {
    res.send('Not found')
  }
  else if(res.statusCode === 406) {
    res.send('Bad request (406)')
  }
  else {
    console.log(res.statusCode)
    res.send('Server error')
  }
})

// for debugging
if(node_env === 'development') {
  const os = require('os');
  app.get('/test', (req, res, next) => { res.send(`Hello from ${os.hostname()}`) });
}

app.listen(port, () => {
  console.log(`Server started on port ${port} in mode ${node_env}`);
});
