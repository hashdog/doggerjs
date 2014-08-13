'use strict';

module.exports = function(app, passport) {

  var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.json(401, { message: 'Not logged' });
  };

  // Import controllers
  var index = require('../controllers/index'),
      users = require('../controllers/users');

  // Set api routes
  app.route(app.config.apiPrefix + '/version')
    .get(index.apiVersion);

  // Setting the local strategy route
  app.route(app.config.apiPrefix + '/login')
    .post(passport.authenticate('local'), function(req, res) {
      res.send({
        user: req.user,
        redirect: (req.user.roles.indexOf('admin') !== -1) ? req.get('referer') : false
      });
    });

  // Close sessions
  app.route(app.config.apiPrefix + '/logout')
    .get(users.logout);

  // Forgot Password
  app.route(app.config.apiPrefix + '/forgot-password')
    .get(users.forgotpassword);

};
