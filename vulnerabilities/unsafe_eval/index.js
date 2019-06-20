const express = require('express');
// var childProcess = require('child_process');

module.exports = (function() {
  'use strict';
  const api = express.Router();

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/unsafe_eval/views/index');
  });

  api.get('/unsafe', function(req, res) {
    // this should be tainted
    const input = req.query.name;
    const data = eval(`({name:'${input}'})`);
    res.send(`<xmp>${data.name}`);
  });

  return api;
})();
