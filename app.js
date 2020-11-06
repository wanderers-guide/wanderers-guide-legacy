require('dotenv').config();

const express = require('express');
const socket = require('socket.io');
const expressSession = require('express-session');

const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const passport = require('passport');
const passportSetup = require('./config/passport-setup');

const favicon = require('serve-favicon');

const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');
const apiRoutes = require('./routes/api-routes');
const browseRoutes = require('./routes/browse-routes');
const profileRoutes = require('./routes/profile-routes');
const coreRoutes = require('./routes/core-routes');
const errorRoutes = require('./routes/error-routes');

const SocketConnections = require('./js/SocketConnections');

const keys = require('./config/keys');
const path = require('path');

const fs = require('fs');
const https = require('https');
const http = require('http');

const app = express();

// Rate Limiter
const rateLimiterFlexible = require('rate-limiter-flexible');
const rateOptions = {
  points: 6, // 6 points
  duration: 1, // Per second
};
const rateLimiter = new rateLimiterFlexible.RateLimiterMemory(rateOptions);

// Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
      chooseSelection: function(checkedValue, currentValue) {
        return checkedValue === currentValue ? ' selected' : '';
      },
      getBoostFlawElement: function(array, index) {
        return array[index] != null ? array[index].boostedAbility : '';
      },
      section: function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
      ifEqual: function(a, b, options) {
        if (a == b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
      },
      defaultAncestry: function(checkedName, currentName) {
        return checkedName === currentName ? 'selectedAncestryOption' : null;
      },
    }
}));

app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// Setup Express Session
let sessionMiddleware = expressSession({
  secret: keys.session.expressSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: (process.env.PRODUCTION == 'true') ? true : false,
    maxAge: 8 * 24 * 60 * 60 * 1000
  }
});
app.use(sessionMiddleware);

// Server Setup
let server = null;
if (process.env.PRODUCTION == 'true'){
  
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/wanderersguide.app/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/wanderersguide.app/cert.pem', 'utf8')
  };

  server = https.createServer(options, app).listen(443);

} else {

  server = http.createServer(app).listen(80);

}

// Socket IO
const io = socket(server);

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set FavIcon
app.use(favicon('./public/images/favicon.ico'));

// Databases
const backgroundDB = require('./config/databases/background-database');
const contentDB = require('./config/databases/content-database');

// Testing Database Connections
backgroundDB.authenticate()
  .then(() => console.log('Background Database connected...'))
  .catch(err => console.log('Database Connection Error: ' + err));
  
contentDB.authenticate()
  .then(() => console.log('Content Database connected...'))
  .catch(err => console.log('Database Connection Error: ' + err));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Security Headers
app.use(function(req, res, next) {
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

// Rate Limiter
app.use(function(req, res, next) {
  rateLimiter.consume(req.ipAddress, 2) // -> consume 2 points
    .then((rateLimiterRes) => { // Points consumed
      return next();
    }).catch((rateLimiterRes) => { // Not enough points to consume
      return res.sendStatus(429);
    });
});

// Set up Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);
app.use('/browse', browseRoutes);
app.use('/', coreRoutes);
app.use('*', errorRoutes); // 404 Route

io.setMaxListeners(19);
SocketConnections.sheetItems(io);
SocketConnections.sheetConditions(io);
SocketConnections.sheetCompanions(io);
SocketConnections.sheetGeneral(io);
SocketConnections.sheetSpells(io);

SocketConnections.builderBasics(io);
SocketConnections.builderAncestry(io);
SocketConnections.builderBackground(io);
SocketConnections.builderClass(io);
SocketConnections.builderFinalize(io);
SocketConnections.builderGeneral(io);

SocketConnections.builderGeneralProcessing(io);
SocketConnections.builderWSC(io);

SocketConnections.homebrewGeneral(io);
SocketConnections.homebrewBuilder(io);

SocketConnections.homePage(io);
SocketConnections.browse(io);
SocketConnections.adminPanel(io);
SocketConnections.appAPI(io);