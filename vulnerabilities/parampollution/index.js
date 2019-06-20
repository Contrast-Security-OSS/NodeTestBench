const express = require('express');

module.exports = (function() {
  'use strict';
  const api = express.Router();

  api.all('/', function(req, res) {
    res.render('../vulnerabilities/parampollution/views/index');
  });

  api.all('/hpp', function(req, res) {
    res.render('../vulnerabilities/parampollution/views/index');
  });

  return api;
})();
