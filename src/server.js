const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const database = require('./config/mongo.js');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const favicon = require('serve-favicon');
const path = require('path');

const app = express();

database.connect(process.env.DB_CONNECTION)
  .then(() => { console.log('Connected to database'); })
  .catch(err => { console.log('Error connecting to database: ' + err);
  });

// middlewares
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(morgan('dev'));

// authentication middlewares
app.use(express.json());
require('./config/passport').init();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// juicy little way to add a flag if a user is logged in so ejs get render the right navbar
app.use(function(req, res, next) {
    if(req.cookies && req.cookies.token) {
      try {
        const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        res.locals.logged_in = true;
      }
      catch {
        // this shouldn't be invoked but in case they have an invalid token
        res.clearCookie('token');
      }
    }
    next();
});

// routes
app.get('/', (req, res, next) => { res.render('index') });
app.get('/about', (req, res, next) => { res.render('about') });
app.get('/recover', (req, res, next) => { res.render('password_recovery') });
app.get('/faq', (req, res, next) => { res.render('faq') });
app.use('/forgot', require('./routes/ForgotPasswordRoute'));
app.use('/newsletter', require('./routes/MailingListRoute'));
app.use('/status', require('./routes/StatusRoute'));
// app.use('/apply', require('./routes/ApplyRoute'));
app.use('/login', require('./routes/LoginRoute'));
app.use('/logout', require('./routes/LogoutRoute'));

// unauthorized
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).render('unauthorized', { title: err.name });
  }
});

app.listen(process.env.SITE_PORT, () => {
  console.log(`Server started on port ${process.env.SITE_PORT} in mode ${process.env.NODE_ENV}`);
});
