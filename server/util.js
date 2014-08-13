'use strict';

var fs = require('fs'),
    path = require('path');

// regex - any file with .js or .coffee extension
var regex = /(.*).(js|coffee)$/;

// Walk through a dir
exports.walk = function(dir, callback) {
  var _walk = function(dir) {
    if (!fs.existsSync(dir)) return;

    fs.readdirSync(dir).forEach(function(file) {
      var newPath = path.join(dir, file),
          stat = fs.statSync(newPath);

      if (stat.isFile() && regex.test(file)) return callback(newPath);
      if (stat.isDirectory()) return _walk(newPath);
    });
  };

  _walk(dir);
};

// Load configurations
exports.loadConfig = function() {
  var configPath = process.cwd() + '/config/env',
      configAll = require(configPath + '/all');

  // Set the node environment variable if not set before
  process.env.NODE_ENV = ~fs.readdirSync(configPath).map(function(file) {
    return file.slice(0, -3);
  }).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

  var configEnv = require(configPath + '/' + process.env.NODE_ENV) || {};

  // Extend the base config in all.js with the enviroment configuration file
  Object.keys(configEnv).forEach(function(key) {
    configAll[key] = configEnv[key];
  });

  return configAll;
};
