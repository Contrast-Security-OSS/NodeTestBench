'use strict';

const express = require('express');
const { get } = require('lodash');
const path = require('path');

const { utils } = require('@contrast/test-bench-utils');

/**
 * @callback ResponseFn
 * @param {any} result
 * @param {express.Request} req
 * @param {express.Response} res
 * @return {any}
 */

/**
 * @type {ResponseFn}
 */
const defaultRespond = (result, req, res) => res.send(result);

/**
 * Configures a route to handle sinks configured by our shared test-bench-utils
 * module.
 *
 * @param {string} vulnerability the vulnerability or rule being tested
 * @param {Object} opts
 * @param {Object} opts.locals additional locals to provide to EJS
 * @param {ResponseFn} opts.respond if provided, a custom return or response
 */
module.exports = function controllerFactory(
  vulnerability,
  { locals = {}, respond = defaultRespond } = {}
) {
  const router = express.Router();
  const sinkData = utils.getSinkData(vulnerability, 'express');
  const groupedSinkData = utils.groupSinkData(sinkData);
  const routeMeta = utils.getRouteMeta(vulnerability);

  router.get('/', function(req, res) {
    res.render(
      path.resolve(
        __dirname,
        '..',
        'vulnerabilities',
        vulnerability,
        'views',
        'index'
      ),
      {
        ...routeMeta,
        groupedSinkData,
        sinkData,
        ...locals
      }
    );
  });

  sinkData.forEach(({ method, uri, sink, key }) => {
    router[method](`${uri}/safe`, async (req, res) => {
      const { input } = get(req, key);
      const result = await sink(input, { safe: true });
      respond(result, req, res);
    });

    router[method](`${uri}/unsafe`, async (req, res) => {
      const { input } = get(req, key);
      const result = await sink(input);
      respond(result, req, res);
    });

    router[method](`${uri}/noop`, async (req, res) => {
      // const { input } = get(req, key);
      const input = 'noop';
      const result = await sink(input, { noop: true });
      respond(result, req, res);
    });
  });

  return router;
};
