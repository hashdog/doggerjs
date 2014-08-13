'use strict';

module.exports = {
  db: 'mongodb://localhost/doggerjs-prod',
  facebook: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: 'CONSUMER_KEY',
    clientSecret: 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  google: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },

  // Sender address like ME <me@doggerjs.com>
  emailFrom: 'SENDER EMAIL ADDRESS',
  mailer: {
    service: 'SERVICE_PROVIDER',
    auth: {
      user: 'EMAIL_ID',
      pass: 'PASSWORD'
    }
  }
};
