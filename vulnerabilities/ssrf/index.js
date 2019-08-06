'use strict';
const exp = require('express');
const router = exp.Router();
const path = require('path');
const {
  routes: {
    ssrf: { sinks }
  },
  frameworkMapping: { express },
  sinks: { ssrf }
} = require('@contrast/test-bench-utils');
const EXAMPLE_URL = 'http://www.example.com';

const { method, key } = express.query;
router.get('/', function(req, res) {
  res.render(path.resolve(__dirname, './views/index'), {
    requestUrl: 'http://www.example.com'
  });
});

sinks.forEach((sink) => {
  const lib = sink.toLowerCase();
  router[method](`/${lib}/query`, function(req, res, next) {
    const url = `${EXAMPLE_URL}?q=${req[key].input}`;
    return ssrf[`make${sink}Request`](url).then((data) => {
      res.send(data);
    });
  });

  router[method](`/${lib}/path`, function(req, res, next) {
    const url = `http://${req[key].input}`;
    return ssrf[`make${sink}Request`](url).then((data) => {
      res.send(data);
    });
  });
});

module.exports = router;
