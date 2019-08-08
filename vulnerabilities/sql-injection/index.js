'use strict';

const express = require('express');
const util = require('util');

const { utils } = require('@contrast/test-bench-utils');

module.exports = (function() {
  const api = express.Router();
  const viewData = utils.getViewData('sql_injection', 'express');

  api.get('/', function(req, res) {
    res.render(`${__dirname}/views/index`, { viewData });
  });

  viewData.forEach(({ method, uri, sink, key }) => {
    api[method](`${uri}/safe`, async (req, res) => {
      const result = await sink('clown');
      res.send(util.inspect(result));
    });

    api[method](`${uri}/unsafe`, async (req, res) => {
      const result = await sink(req[key].input);
      res.send(util.inspect(result));
    });
  });

  return api;
})();
