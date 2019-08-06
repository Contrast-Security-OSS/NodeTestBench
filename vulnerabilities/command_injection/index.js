'use strict';
const exp = require('express');
const {
  sinks: { cmd_injection: cmdi },
  routes: {
    cmd_injection: { base, sinks }
  },
  frameworkMapping: { express },
  utils: { buildUrls }
} = require('@contrast/test-bench-utils');

module.exports = (function() {
  const api = exp.Router();
  const { method, key } = express.query;
  const viewData = buildUrls({ sinks, key, baseUri: base });

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/command_injection/views/index', {
      viewData
    });
  });

  viewData.forEach(({ uri, sink }) => {
    api[method](`${uri}/safe`, (req, res) => {
      res.send('SAFE');
    });

    api[method](`${uri}/unsafe`, async (req, res) => {
      const cmd = req[key].input;
      const data = await cmdi[sink](cmd);
      res.send(data.toString());
    });
  });

  return api;
})();
