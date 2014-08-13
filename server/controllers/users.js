'use strict';

// Module dependencies
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    async = require('async'),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    templates = require('../templates'),
    config = require('../util').loadConfig();

// Helpers
// Send reset password email
var sendMail = function(mailOptions) {
  var transport = nodemailer.createTransport('SMTP', config.mailer);
  transport.sendMail(mailOptions, function(err, response) {
    if (err) return err;
    return response;
  });
};

// Auth callback
exports.authCallback = function(req, res) {
  res.redirect('/');
};

// Logout
exports.logout = function(req, res) {
  req.logout();
  res.send(200);
};

// Resets the password
exports.resetpassword = function(req, res, next) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  }, function(err, user) {
    if (err) return res.status(400).json({ msg: err });
    if (!user) return res.status(400).json({ msg: 'Token invalid or expired' });

    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) return res.status(400).send(errors);

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save(function(err) {
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.send({ user: user });
      });
    });
  });
};

// Callback for forgot password link
exports.forgotpassword = function(req, res, next) {
  async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({
          $or: [{ email: req.body.text }, { username: req.body.text }]
        }, function(err, user) {
          if (err || !user) return done(true);
          done(err, user, token);
        });
      },
      function(user, token, done) {
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      },
      function(token, user, done) {
        var mailOptions = {
          to: user.email,
          from: config.emailFrom
        };
        mailOptions = templates.forgot_password_email(user, req, token, mailOptions);
        sendMail(mailOptions);
        done(null, true);
      }
    ],
    function(err, status) {
      var response = {
        message: 'Mail successfully sent',
        status: 'success'
      };
      if (err) {
        response.message = 'User does not exist';
        response.status = 'danger';
      }

      res.json(response);
    }
  );
};
