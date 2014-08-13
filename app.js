'use strict';

// Module dependencies
var dogger = require(__dirname + '/server/bootstrap');

// Init DoggerJS app
dogger.init(function(app) {
  console.log('DoggerJS app started on port ' + app.config.port + ' (' + process.env.NODE_ENV + ')');
});
