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
    maxAge: 24 * 60 * 60 * 1000
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
  .catch(err => console.error('Error: ' + err));
  
contentDB.authenticate()
  .then(() => console.log('Content Database connected...'))
  .catch(err => console.error('Error: ' + err));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);
app.use('/', coreRoutes);
app.use('*', errorRoutes); // 404 Route

io.setMaxListeners(15);
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

SocketConnections.homePage(io);
SocketConnections.adminPanel(io);