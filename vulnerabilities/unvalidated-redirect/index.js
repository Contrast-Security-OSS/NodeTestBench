const express = require('express');

module.exports = (function() {
  'use strict';
  const api = express.Router();

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/unvalidated-redirect/views/index');
  });

  api.get('/redir', function(req, res) {
    const path = req.query.user_path;
    res.redirect(path);
  });

  api.get('/redir_status', function(req, res) {
    const path = req.query.user_path;
    res.redirect(302, path);
  });

  return api;
})();
