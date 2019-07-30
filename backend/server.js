const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const database = require('./config/mongo.js');
const session = require('express-session');
const passport = require('passport');
require('./config/passport').init();

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // enable in production
  // cookie: { httpOnly: true, maxAge: 2419200000 }
  // cookie: { secure: true }
}));
app.use(passport.initialize())
//app.use(passport.session())

// ----- TEMPORARY UNDER CONSTRUCTION PAGE -----
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.render('/public/index.html')
});
// -------------------- END --------------------

// ------------ TEMPORARY FOR AUTH -------------
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.get('/register', (req, res, next) => {
    res.render('register', {title: 'Register'});
});
app.post('/register', (req, res, next) => {
  const UserController = require('./controllers/UserController');
  var stem, non_stem, year, dietary;
  year = new Date(req.body.year).getFullYear();
  if(dietary === "") dietary = null;
  if(req.body.stem === 'This is a STEM degree') {
    stem = true;
    non_stem = false;
  }
  else if(req.body.stem === 'This is a Non-STEM degree') {
    stem = false;
    non_stem = true;
  }
  else {
    stem = true;
    non_stem = true;
  }
    const user = {
      name: req.body.first_name + " " + req.body.last_name,
      email: req.body.email,
      city: req.body.city,
      university: req.body.university,
      program_name: req.body.program,
      program_type: req.body.type,
      grad_year: year,
      isStem: stem,
      isNonStem: non_stem,
      dietary_restrictions: dietary,
      shirt_size: req.body.shirt_size,
      resume: req.body.resume,
      password: req.body.password,
      passwordMatch: req.body.passwordMatch
    }
    UserController.create(user)
    .then(result => {
      res.render('register', { title: 'Registration Complete', success: 'User successfully created, please login', debug: result } );
    })
    .catch(errors => {
      res.render('register', { title: 'Registration Error', errors } );
    });
});
app.get('/login', (req, res, next) => {
    res.render('login', {title: 'Login'});
});
app.get('/dashboard', (req, res, next) => {
    res.render('dashboard', {title: 'Dashboard'});
});
// -------------------- END --------------------

// routes
app.use('/user', require('./routes/UserRoute'));
app.use('/settings', require('./routes/SettingsRoute'));
app.use('/auth', require('./routes/AuthRoute'));

// unauthorized
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

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
