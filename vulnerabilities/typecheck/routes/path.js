'use strict';

const express = require('express');
const path = require('path');

const Router = express.Router;

const api = (module.exports = Router());

api
  .get('/', (req, res) => {
    res.render(__dirname + '/../views/path.ejs');
  })

  .get('/parse', (req, res) => {
    try {
      const input = req.query.input;
      path.parse(input);
      res.send(req.query.input);
    } catch (e) {
      res.send();
    }
  })

  .get('/resolve', (req, res) => {
    try {
      const input = req.query.input;
      path.resolve('a', 'b', input);
      res.send(input);
    } catch (e) {
      res.send();
    }
  })

  .get('/extname', (req, res) => {
    try {
      const input = req.query.input;
      path.extname(input);
      res.send(input);
    } catch (e) {
      res.send();
    }
  });
