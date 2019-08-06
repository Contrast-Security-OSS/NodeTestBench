'use strict';
const exp = require('express');
const {
  sinks: { ssjs },
  routes: {
    ssjs: { base, sinks }
  },
  frameworkMapping: { express },
  utils: { buildUrls }
} = require('@contrast/test-bench-utils');

module.exports = (function() {
  const api = exp.Router();
  const { method, key } = express.query;
  const viewData = buildUrls({ sinks, key, baseUri: base });

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/ssjs-injection/views/index', {
      viewData
    });
  });

  viewData.forEach(({ uri, sink }) => {
    api[method](`${uri}/safe`, (req, res) => {
      res.send('SAFE');
    });

    api[method](`${uri}/unsafe`, async (req, res) => {
      const cmd = req[key].input;
      const data = await ssjs[sink](cmd);
      res.send(data);
    });
  });

  return api;
})();
