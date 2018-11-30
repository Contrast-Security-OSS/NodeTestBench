'use strict';
const sr = require('stealthy-require');

const express = sr(require.cache, () => {
  return require('express');
});

module.exports = (function(){
  // simple XSS but express is outside of the require cache.
  let api = express.Router();
  
  api.get('/', (req, res) => {
    res.render(__dirname + '/views/index');
  });
  
  api.get('/xss', (req, res) => {
    res.send(req.query.input);
  });

  return api;
})();
