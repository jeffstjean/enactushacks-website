const path = require('path');

const dotenv = require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const cookieSession = require('cookie-session')

const database = require('./config/mongo.js').connect(process.env.DB_CONNECTION)
  .then(() => { console.log('Connected to database') })
  .catch((err) => { console.log(err) })
const { accepting_applications } = require('./config/config.js');
const cookie_config = require('./config/cookies')

// app configuration
const port = 5000
const node_env = process.env.NODE_ENV || 'development'
const app = express();

// middlewares
app.use(express.static('public'));
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession(cookie_config));
app.use(express.json());
if(node_env === 'production') app.use(morgan('combined'));
else app.use(morgan('dev'));

// ejs registration
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// routes
app.get('/', (req, res, next) => { res.render('index') });
app.use('/', require('./routes/MailingListRoute'));
app.use('/', require('./routes/UserRoute'));
// for debugging
if(node_env === 'development') {
  const os = require('os');
  app.get('/test', (req, res, next) => { res.send(`Hello from ${os.hostname()}`) });
}
app.use((error, req, res, next) => {
  console.log(error)
  if(res.statusCode === 406) {
    res.send('406 Bad request')
  }
  else if (res.statusCode >= 500) {
    res.send('500 Server error')
  }
  else {
    res.status(404).send('404 Not found')
  }
})

app.listen(port, () => {
  console.log(`Server started on port ${port} in mode ${node_env}`);
});
