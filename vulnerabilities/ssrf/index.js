'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const {
  sinks: { ssrf }
} = require('@contrast/test-bench-utils');
const EXAMPLE_URL = 'http://www.example.com';

router.get('/', function(req, res) {
  res.render(path.resolve(__dirname, './views/index'), {
    requestUrl: 'http://www.example.com'
  });
});

const libs = ['axios', 'bent', 'fetch', 'request', 'superagent'];

libs.forEach((lib) => {
  router.get(`/${lib}/query`, function(req, res, next) {
    const url = `${EXAMPLE_URL}?q=${req.query.input}`;
    return makeRequest(lib, url).then((data) => {
      res.send(data);
    });
  });

  router.get(`/${lib}/path`, function(req, res, next) {
    const url = `http://${req.query.input}`;
    return makeRequest(lib, url).then((data) => {
      res.send(data);
    });
  });
});

const makeRequest = function makeRequest(lib, url) {
  switch (lib) {
    case 'axios':
      return ssrf.makeAxiosRequest(url);
    case 'bent':
      return ssrf.makeBentRequest(url);
    case 'fetch':
      return ssrf.makeFetchRequest(url);
    case 'request':
      return ssrf.makeRequestRequest(url);
    case 'superagent':
      return ssrf.makeSuperagentRequest(url);
  }
};

module.exports = router;
