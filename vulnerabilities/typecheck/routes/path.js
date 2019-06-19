'use strict';

const express = require('express');
const path = require('path');

const { Router } = express;

const api = (module.exports = Router());

api
  .get('/', (req, res) => {
    res.render(`${__dirname}/../views/path.ejs`);
  })

  .get('/parse', (req, res) => {
    try {
      const { input } = req.query;
      path.parse(input);
      res.send(req.query.input);
    } catch (e) {
      res.send();
    }
  })

  .get('/resolve', (req, res) => {
    try {
      const { input } = req.query;
      path.resolve('a', 'b', input);
      res.send(input);
    } catch (e) {
      res.send();
    }
  })

  .get('/extname', (req, res) => {
    try {
      const { input } = req.query;
      path.extname(input);
      res.send(input);
    } catch (e) {
      res.send();
    }
  });
