'use strict';

exports.apiVersion = function(req, res) {
  res.json({ version: 1 });
};

exports.render = function(req, res) {
  res.redirect('/#' + req.originalUrl);
};
