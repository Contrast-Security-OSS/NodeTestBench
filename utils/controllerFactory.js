'use strict';

const express = require('express');
const { get } = require('lodash');

const { utils } = require('@contrast/test-bench-utils');

/**
 * Configures a route to handle sinks configured by our shared test-bench-utils
 * module.
 *
 * @param {string} vulnerability the vulnerability or rule being tested
 * @param {Object} ejsData       additional data to provide to the view renderer for this page
 */
module.exports = function controllerFactory(vulnerability, ejsData) {
  const api = express.Router();
  const sinkData = utils.getSinkData(vulnerability, 'express');
  const groupedSinkData = utils.groupSinkData(sinkData);

  api.get('/', function(req, res) {
    res.render(`${__dirname}/../vulnerabilities/${vulnerability}/views/index`, {
      groupedSinkData,
      sinkData,
      ...ejsData
    });
  });

  sinkData.forEach(({ method, uri, sink, key }) => {
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
