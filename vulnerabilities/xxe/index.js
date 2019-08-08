'use strict';
const exp = require('express');
const {
  sinks: { xxe },
  routes: {
    xxe: { base: baseUri, sinks }
  },
  frameworkMapping: { express },
  utils: { attackXml }
} = require('@contrast/test-bench-utils');

const api = exp.Router();
api.get('/', function(req, res) {
  res.render('../vulnerabilities/xxe/views/index', {
    attackXml,
    url: baseUri
  });
});

const { method } = express.body;
sinks.forEach((sink) => {
  api[method](`/safe`, (req, res) => {
    const data = xxe[sink](attackXml, true);
    res.send(data.toString());
  });

  api[method](`/unsafe`, (req, res) => {
    const data = xxe[sink](attackXml);
    res.send(data.toString());
  });
});

module.exports = api;
