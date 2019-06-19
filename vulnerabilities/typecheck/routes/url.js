const url = require('url');
const express = require('express');

module.exports = (function() {
  'use strict';
  const api = express.Router();

  api.get('/', function(req, res) {
    res.render(`${__dirname}/../views/url.ejs`);
  });

  api.get('/resolve', (req, res) => {
    const { input } = req.query;
    const i = `http://localhost:19080/${input}/`;
    const r = input;

    try {
      // eslint-disable-next-line node/no-deprecated-api
      url.resolve(i, r);
      res.send(i);
    } catch (err) {
      res.send(err);
    }
  });
  api.get('/parse', (req, res) => {
    const { input } = req.query;
    const i = `http://localhost:19080/?input=${input}`;

    try {
      // eslint-disable-next-line node/no-deprecated-api
      url.parse(i);
      res.send(i);
    } catch (err) {
      res.send(err);
    }
  });

  return api;
})();
