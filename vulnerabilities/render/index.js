'use strict';
const express = require('express');
const api = express.Router();

api.get('/', (req, res) => {
  res.render(`${__dirname}/views/index`);
});

api.get('/xss', (req, res) => {
  res.render(`${__dirname}/views/vulnerability`, {
    name: req.query.input
  });
});

module.exports = api;
