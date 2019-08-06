'use strict';
const exp = require('express');
const {
  sinks: { path_traversal: fs },
  routes: {
    path_traversal: { base: baseUri, sinks }
  },
  frameworkMapping: { express },
  utils: { buildUrls }
} = require('@contrast/test-bench-utils');

module.exports = (function() {
  const api = exp.Router();
  const { method, key } = express.query;
  const viewData = buildUrls({ sinks, key, baseUri });

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/path-traversal/views/index', {
      viewData
    });
  });

  viewData.forEach(({ uri, sink }) => {
    api[method](`${uri}/no-op`, (req, res) => {
      res.send('PROBE');
    });

    api[method](`${uri}/safe`, async (req, res) => {
      const path = encodeURIComponent(req[key].input);
      const data = await fs[sink](path, true);
      res.send(data.toString());
    });

    api[method](`${uri}/unsafe`, async (req, res) => {
      const path = req[key].input;
      const data = await fs[sink](path);
      res.send(data.toString());
    });
  });

  return api;
})();
