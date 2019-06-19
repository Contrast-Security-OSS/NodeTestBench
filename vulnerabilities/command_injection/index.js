const express = require('express');
const childProcess = require('child_process');

module.exports = (function() {
  'use strict';
  const api = express.Router();

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/command_injection/views/index');
  });

  api.get('/childprocess_exec', function(req, res) {
    // this should be tainted
    const path = req.query.user_path;

    const ls = 'ls -l ';

    // propagation from path with concat of ls to new var cmd
    const cmd = ls + path;

    // trigger command injection
    childProcess.exec(cmd, function(err, data) {
      res.send(`<xmp>${data}`);
    });
  });

  return api;
})();
