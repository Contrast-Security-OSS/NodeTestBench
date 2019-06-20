'use strict';
const express = require('express');

function baseHandler(type, safe, req, res) {
  const input = req[type];

  let output;
  if (safe) {
    // this will produce something like <html>[object Object]</html>
    output = `<html>${input}</html>`;
  } else {
    output = `<html${JSON.stringify(input)}</html>`;
  }

  res.send(output);
}

function makeRouteParameters(method, path, type, safe) {
  return {
    method,
    path,
    handler: baseHandler.bind(this, type, safe)
  };
}

module.exports = (function() {
  'use strict';
  const api = express.Router();

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/xss/views/index');
  });

  const routeParams = {
    query: makeRouteParameters('GET', '/query', 'query', false),
    querySafe: makeRouteParameters('GET', '/querySafe', 'query', true),
    param: makeRouteParameters('GET', '/param/:input', 'params', false),
    paramSafe: makeRouteParameters('GET', '/paramSafe/:input', 'params', true),
    header: makeRouteParameters('GET', '/header', 'headers', false),
    headerSafe: makeRouteParameters('GET', '/headerSafe', 'headers', true),
    post: makeRouteParameters('POST', '/post', 'body', false),
    postSafe: makeRouteParameters('POST', '/postSafe', 'body', true)
  };

  Object.getOwnPropertyNames(routeParams).forEach(function(p) {
    const routeParam = routeParams[p];
    const { path } = routeParam;
    const method = routeParam.method.toLowerCase();
    api[method](path, routeParam.handler);
  });

  return api;
})();
