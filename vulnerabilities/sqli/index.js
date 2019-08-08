'use strict';

const express = require('express');
const util = require('util');

const {
  sinks,
  routes,
  frameworkMapping,
  utils
} = require('@contrast/test-bench-utils');

module.exports = (function() {
  const api = express.Router();
  const { method, key } = frameworkMapping.express.query;
  const viewData = utils.buildUrls({
    sinks: routes.sqli.sinks,
    key,
    baseUri: routes.sqli.base
  });

  api.get('/', function(req, res) {
    res.render(`${__dirname}/views/index`, { viewData });
  });

  viewData.forEach(({ uri, sink }) => {
    api[method](`${uri}/safe`, async (req, res) => {
      const result = await sinks.sqli[sink]('clown');
      res.send(util.inspect(result));
    });

    api[method](`${uri}/unsafe`, async (req, res) => {
      const result = await sinks.sqli[sink](req[key].input);
      res.send(util.inspect(result));
    });
  });

  return api;
})();
