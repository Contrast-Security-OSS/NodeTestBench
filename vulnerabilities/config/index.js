const express = require('express');

module.exports = (function() {
  'use strict';
  const api = express.Router();

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/config/views/index');
  });

  return api;
})();
