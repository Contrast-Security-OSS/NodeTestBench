'use strict';
const exp = require('express');
const {
  routes: {
    unvalidated_redirect: { base: baseUri }
  },
  frameworkMapping: { express }
} = require('@contrast/test-bench-utils');

const routes = ['', '/status'];

module.exports = (function() {
  const { method, key } = express.query;
  const api = exp.Router();

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/unvalidated-redirect/views/index', {
      res: 'res',
      url: baseUri
    });
  });

  routes.forEach((route) => {
    api[method](`${route}/safe`, function(req, res) {
      const path = encodeURIComponent(req[key].input);
      route.includes('status') ? res.redirect(302, path) : res.redirect(path);
    });

    api[method](`${route}/unsafe`, function(req, res) {
      const path = req[key].input;
      route.includes('status') ? res.redirect(302, path) : res.redirect(path);
    });
  });

  return api;
})();
