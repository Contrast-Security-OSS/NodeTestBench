'use strict';
const express = require('express');

const { sinks, utils } = require('@contrast/test-bench-utils');

// function baseHandler(type, safe, req, res) {
//   const input = safe ? encodeURIComponent(req[type].input) : req[type].input;
//
//   const output = `<html>${input}</html>`;
//   res.send(output);
// }

// function makeRouteParameters(method, path, type, safe) {
//   return {
//     method,
//     path,
//     handler: baseHandler.bind(this, type, safe)
//   };
// }

module.exports = (function() {
  'use strict';
  const api = express.Router();
  const viewData = utils.getViewData('xss', 'express');

  api.get('/', function(req, res) {
    res.render(`${__dirname}/views/index`, { viewData });
  });

  viewData.forEach(({ uri, sink, method, key }) => {
    api[method](`${uri}/safe`, (req, res) => {
      const { input } = req[key];
      res.send(sinks.xss[sink](input, true));
    });

    api[method](`${uri}/unsafe`, (req, res) => {
      const { input } = req[key];
      res.send(sinks.xss[sink](input));
    });
  });

  // api.post('/header_test', function(req, res) {
  //   res.json({
  //     'Accept-Language': req.get('Accept-Language'),
  //     body: '<html><body><p>Hello,World</p></body></html>'
  //   });
  // });

  // const routeParams = {
  //   query: makeRouteParameters('GET', '/query', 'query', false),
  //   querySafe: makeRouteParameters('GET', '/querySafe', 'query', true),
  //   param: makeRouteParameters('GET', '/param/:input', 'params', false),
  //   paramSafe: makeRouteParameters('GET', '/paramSafe/:input', 'params', true),
  //   header: makeRouteParameters('GET', '/header', 'headers', false),
  //   headerSafe: makeRouteParameters('GET', '/headerSafe', 'headers', true),
  //   post: makeRouteParameters('POST', '/post', 'body', false),
  //   postSafe: makeRouteParameters('POST', '/postSafe', 'body', true)
  // };

  // Object.getOwnPropertyNames(routeParams).forEach(function(p) {
  //   const routeParam = routeParams[p];
  //   const { path } = routeParam;
  //   const method = routeParam.method.toLowerCase();
  //   api[method](path, routeParam.handler);
  // });

  return api;
})();
