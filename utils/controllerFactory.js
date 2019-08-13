'use strict';

const { get } = require('lodash');
const express = require('express');

const { utils } = require('@contrast/test-bench-utils');

module.exports = function controllerFactory(vulnerability) {
  const api = express.Router();
  const viewData = utils.getViewData(vulnerability, 'express');

  api.get('/', function(req, res) {
    res.render(`${__dirname}/${vulnerability}/views/index`, { viewData });
  });

  viewData.forEach(({ method, uri, sink, key }) => {
    api[method](`${uri}/safe`, async (req, res) => {
      const { input } = get(req, key);
      const result = await sink(input, { safe: true });
      res.send(result);
    });

    api[method](`${uri}/unsafe`, async (req, res) => {
      const { input } = get(req, key);
      const result = await sink(input);
      res.send(result);
    });

    api[method](`${uri}/noop`, async (req, res) => {
      const { input } = get(req, key);
      const result = await sink(input, { noop: true });
      res.send(result);
    });
  });

  return api;
};
