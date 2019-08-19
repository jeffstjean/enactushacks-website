const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const database = require('./config/mongo.js');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();

database.connect('mongodb://' + process.env.MONGO_NAME + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_NAME)
  .then(() => { console.log('Connected to database'); })
  .catch(err => { console.log('Error connecting to database: ' + err);
});

// middlewares
app.use(morgan('dev'));

app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
// need a session store
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  secure: false
}));

// authentication middlewares
app.use(express.json());
require('./config/passport').init();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// routes
app.get('/', (req, res, next) => { res.render('index', { title: 'EnactusHacks' }) });

app.use('/login', require('./routes/LoginRoute'));
app.use('/logout', require('./routes/LoginRoute'));
app.use('/register', require('./routes/RegisterRoute'));
app.use('/forgot', require('./routes/ForgotRoute'));
app.use('/dashboard', require('./routes/DashboardRoute'));
app.use('/user', require('./routes/UserRoute'));
app.use('/settings', require('./routes/SettingsRoute'));
app.use('/verify', require('./routes/VerifyRoute'));

// unauthorized
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    // res.status(401).render('unauthorized', { title: err.name });
    res.status(401).send('Unauthorized')
  }
});

app.listen(process.env.SITE_PORT, () => {
  console.log(`Server started on port ${process.env.SITE_PORT} in mode ${process.env.NODE_ENV}`);
});
