'use strict';

// Module dependencies
var bodyParser = require('body-parser'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    express = require('express'),
    expressValidator = require('express-validator'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    passport = require('passport'),
    path = require('path'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    util = require('./util'),
    config = util.loadConfig();

exports.init = function(callback) {

  // Init database
  var database = mongoose.connect(config.db),
      conn = mongoose.connection;

  // Logging MongoDB connection error
  conn.on('error', function() {
    console.log('Error: Please ensure mongod is running and restart the app.');
  });

  // ExpressJS settings
  var app = express();
  app.config = config;

  /*
   * Should be placed before express.static to ensure
   * that all assets and data are compressed (utilize bandwidth)
   * level: 0 is no compression and 9 is best compression, but slowest
   */
  app.use(compression({ level: 9 }));

  // Only use logger for development environment
  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

  // The cookieParser should be above session
  app.use(cookieParser());

  // Request body parsing middleware should be above methodOverride
  app.use(expressValidator());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride());

  // Session storage using MongoDB
  app.use(session({
    cookie: config.sessionCookie,
    name: config.sessionName,
    resave: true,
    saveUninitialized: true,
    secret: config.sessionSecret,
    store: new mongoStore({
      db: database.connection.db,
      collection: config.sessionCollection
    })
  }));

  // Use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // Set the static path
  app.use(express.static(path.join(config.root, 'public')));

  app.use(function(req, res, next) {
    // Set the 'Powered by' header
    res.header('x-powered-by', config.pkg.name);

    // Set the user cookie
    if (req.user) res.cookie('user', JSON.stringify(req.user));
    next();
  });

  // Require models
  var modelsPath = path.join(config.root, '/server/models');
  util.walk(modelsPath, require);

  // Require and config passport
  var passportPath = path.join(config.root, '/config/passport');
  require(passportPath)(passport, config);

  // Require routes
  var routesPath = path.join(config.root, '/server/routes');
  util.walk(routesPath, function(module) {
    require(module)(app, passport);
  });

  // Assume "not found" in the error msgs is a 404. this is somewhat
  // silly, but valid, you can do whatever you like, set properties,
  // use instanceof etc.
  app.use(function(err, req, res, next) {
    // Treat as 404
    if (~err.message.indexOf('not found')) return next();

    // Log it
    console.error(err.stack);

    // Error page
    res.status(500, { message: err.stack });
  });

  // Assume 404 since no middleware responded
  app.use(function(req, res) {
    res.status(404, {
      url: req.originalUrl,
      error: 'Not found'
    });
  });

  // Error handler - has to be last
  if (process.env.NODE_ENV === 'development') app.use(errorHandler());

  // Listen app
  app.listen(config.port, config.hostname);

  // Return callback
  callback(app);
};
