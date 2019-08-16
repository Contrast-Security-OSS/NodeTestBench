'use strict';

const { get } = require('lodash');
const express = require('express');
const path = require('path');

const { utils } = require('@contrast/test-bench-utils');

const EXAMPLE_URL = 'http://www.example.com';
const router = express.Router();
const sinkData = utils.getSinkData('ssrf', 'express');
const routeMeta = utils.getRouteMeta('ssrf');

/**
 * SSRF has different behavior, so we don't reuse the controllerFactory here.
 */
router.get('/', function(req, res) {
  res.render(path.resolve(__dirname, 'views', 'index'), {
    ...routeMeta,
    requestUrl: 'http://www.example.com',
    sinkData
  });
});

sinkData.forEach(({ method, sink, name, key }) => {
  router[method](`/${name}/query`, async (req, res) => {
    const { input } = get(req, key);
    const url = `${EXAMPLE_URL}?q=${input}`;
    const result = await sink(url);
    res.send(result);
  });

  router[method](`/${name}/path`, async (req, res) => {
    const { input } = get(req, key);
    const url = `http://${input}`;
    const result = await sink(url);
    res.send(result);
  });
});

module.exports = router;
