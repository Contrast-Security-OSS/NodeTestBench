'use strict';
const express = require('express');

const { utils } = require('@contrast/test-bench-utils');

module.exports = (function() {
  'use strict';
  const api = express.Router();
  const sinkData = utils.getSinkData('xss', 'express');
  const viewData = utils.groupSinkData(sinkData);

  api.get('/', function(req, res) {
    res.render(`${__dirname}/views/index`, { viewData });
  });

  sinkData.forEach(({ uri, sink, method, key }) => {
    api[method](`${uri}/safe`, (req, res) => {
      const { input } = req[key];
      res.send(sink(input, true));
    });

    api[method](`${uri}/unsafe`, (req, res) => {
      const { input } = req[key];
      res.send(sink(input));
    });
  });

  return api;
})();
