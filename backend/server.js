const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const database = require('./config/mongo.js');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const app = express();

database.connect(process.env.MONGO_URI).then(() => { console.log('Connected to database'); })
  .catch(err => { console.log('Error connecting to database: ' + err);
});

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

// authentication middlewares
app.use(express.json());
require('./config/passport').init();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// routes
app.get('/', (req, res, next) => { res.render('index') });
app.get('/test', (req, res, next) => { res.render('logged_in_index') });
app.get('/login', (req, res, next) => { res.render('login') });
app.get('/forgot', (req, res, next) => { res.render('password_recovery') });


app.use('/', require('./routes/AuthRoute'));
app.use('/user', require('./routes/UserRoute'));
app.use('/settings', require('./routes/SettingsRoute'));
app.use('/verify', require('./routes/EmailVerificationRoute'));

// unauthorized
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).render('unauthorized', { title: err.name });
  }
});

app.listen(process.env.PORT, process.env.HOSTNAME, () => {
  console.log(`Server started on http://${process.env.HOSTNAME}:${process.env.PORT}`);
});
