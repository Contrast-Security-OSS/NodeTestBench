const url = require('url');
const qs = require('querystring');
const express = require('express');

module.exports = (function() {
  'use strict';
  var api = express.Router();

  api.get('/', function(req, res) {
    res.render(__dirname + "/../views/querystring.ejs");
  });

  api.get('/stringify', (req, res) => {
    const input = req.query.input;
    const i = `http://localhost:19080/?input=${input}`;
    try {
      const u = new url.URL(i);
      res.send(input);
    } catch (err) {
      console.log(err);
      res.send();
    }
  });

  api.get('/parse', (req, res) => {
    const input = req.query.input;
    const i = `http://localhost:19080/?input=${input}`;

    try {
      const u = url.parse(i);
      res.send(i);
    } catch (err) {
      console.log(err);
      res.send();
    }
  });

  return api;
})();
