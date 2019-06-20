const express = require('express');
const fs = require('fs');

module.exports = (function() {
  'use strict';
  const api = express.Router();

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/path-traversal/views/index');
  });

  api.post('/readFile', function(req, res) {
    const path = req.body.user_path;

    fs.readFile(path, 'utf8', function(err, data) {
      res.send(data);
    });
  });

  api.post('/readFile_safe', function(req, res) {
    let path = req.body.user_path;
    path = encodeURIComponent(path);

    fs.readFile(path, 'utf8', function(err, data) {
      if (err) res.send(err);
      res.send(data);
    });
  });

  api.post('/writeFile', function(req, res) {
    const path = req.body.user_path;

    fs.writeFile(path, '', function(err) {
      if (err) throw err;
      res.send("It's saved!");
    });
  });

  return api;
})();
