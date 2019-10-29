'use strict';

const express = require('express');
const path = require('path');

const { utils } = require('@contrast/test-bench-utils');

/**
 * Custom response functions allow you to change the functionality or return
 * value of a sink endpoint.
 *
 * @callback ResponseFn
 * @param {any} result return value of the sink method
 * @param {express.Request} req express request object
 * @param {express.Response} res express response object
 * @param {express.NextFunction} next express `next`
 */

/**
 * @type {ResponseFn}
 */
const defaultRespond = (result, req, res, next) => res.send(result);

/**
 * Configures a route to handle sinks configured by our shared test-bench-utils
 * module.
 *
 * @param {string} vulnerability the vulnerability or rule being tested
 * @param {Object} opts
 * @param {Object} opts.locals additional locals to provide to EJS
 * @param {ResponseFn} opts.respond if provided, a custom return or response
 * @param {express.Router} opts.router if provided, an express router
 * @return {express.Router} a configured express router
 */
module.exports = function controllerFactory(
  vulnerability,
  { locals = {}, respond = defaultRespond, router = express.Router() } = {}
) {
  const sinkData = utils.getSinkData(vulnerability, 'express');
  const groupedSinkData = utils.groupSinkData(sinkData);
  const routeMeta = utils.getRouteMeta(vulnerability);

  router.get('/', function(req, res, next) {
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
    router[method](`${uri}/safe`, async (req, res, next) => {
      const input = utils.getInput({ locals, req, key });
      const result = await sink(input, { safe: true });
      respond(result, req, res, next);
    });

    router[method](`${uri}/unsafe`, async (req, res, next) => {
      const input = utils.getInput({ locals, req, key });
      const result = await sink(input);
      respond(result, req, res, next);
    });

    router[method](`${uri}/noop`, async (req, res, next) => {
      const input = 'noop';
      const result = await sink(input, { noop: true });
      respond(result, req, res, next);
    });
  });

  return router;
};
