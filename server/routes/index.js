'use strict';

module.exports = function(app) {

  // Import controllers
  var index = require('../controllers/index');

  // Render the index
  app.route('/')
    .get(index.render);

  // redirect all others to the index (HTML5 history)
  app.route('*')
    .get(index.render);

};
