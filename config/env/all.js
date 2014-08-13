'use strict';

// Module dependencies
var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..'),
    pkg = require(path.join(rootPath, 'package.json'));

module.exports = {
  pkg: {
    version: pkg.version,
    name: pkg.name
  },
  root: rootPath,
  port: process.env.PORT || 3000,
  hostname: process.env.HOST || process.env.HOSTNAME,
  db: process.env.MONGOHQ_URL,

  // For the API uses
  apiPrefix: '/api',
  apiVersion: 'v1',

  // The name of the MongoDB collection to store sessions
  sessionCollection: 'sessions',

  // The session cookie name
  sessionName: 'dogger.sid',

  // IMPORTANT: This should be set to a non-guessable string
  sessionSecret: 'DoggerJS',

  // The session cookie settings
  sessionCookie: {
    path: '/',
    httpOnly: true,

    /*
     * If secure is set to true then it will cause the cookie to be set
     * only when SSL-enabled (HTTPS) is used, and otherwise it won't
     * set a cookie. 'true' is recommended yet it requires the above
     * mentioned pre-requisite.
     */
    secure: false,

    /*
     * Only set the maxAge to null if the cookie shouldn't be expired
     * at all. The cookie will expunge when the browser is closed.
     */
    maxAge: null
  }
};
