'use strict';

const start = Date.now();
const express = require('express');
/**
 * This allows use to naively handle
 * async controller requests without
 * a catch handler that calls next
 *
 * Instead of:
 * try {
 *   const data = await asyncCall();
 *   res.send(data.toString());
 * } catch(err) {
 *   next(err);
 * }
 *
 * We can do:
 *
 * const data = await asyncCall();
 * res.send(data.toString());
 *
 */
require('express-async-errors');
const bodyParser = require('body-parser');
const layouts = require('express-ejs-layouts');
const http = require('http');
const https = require('https');
const pem = require('pem');

const app = express();
const {
  rules,
  routes: {
    cmdInjection,
    nosqlInjection,
    pathTraversal,
    sqlInjection,
    ssjs,
    ssrf,
    unsafeFileUpload,
    unvalidatedRedirect,
    xss,
    xxe
  },
  navRoutes
} = require('@contrast/test-bench-utils');

rules.static();

app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(layouts);

app.use(xss.base, require('./vulnerabilities/xss'));
app.use(sqlInjection.base, require('./vulnerabilities/sqlInjection'));
app.use(cmdInjection.base, require('./vulnerabilities/cmdInjection'));
app.use(nosqlInjection.base, require('./vulnerabilities/nosqlInjection'));
app.use('/crypto', require('./vulnerabilities/crypto'));
app.use('/parampollution', require('./vulnerabilities/parampollution'));
app.use(
  unvalidatedRedirect.base,
  require('./vulnerabilities/unvalidatedRedirect')
);
app.use(pathTraversal.base, require('./vulnerabilities/pathTraversal'));
app.use('/header-injection', require('./vulnerabilities/header-injection'));
app.use(
  '/csp-header-insecure',
  require('./vulnerabilities/csp-header-insecure')
);
app.use('/config', require('./vulnerabilities/config'));
app.use('/serialization', require('./vulnerabilities/serialization'));
app.use(ssjs.base, require('./vulnerabilities/ssjs'));
app.use(xxe.base, require('./vulnerabilities/xxe'));
app.use('/mongoose', require('./vulnerabilities/mongoose'));
app.use('/typecheck', require('./vulnerabilities/typecheck'));
app.use('/mongoose', require('./vulnerabilities/mongoose'));
app.use('/express-session', require('./vulnerabilities/express-session'));
app.use('/ddb', require('./vulnerabilities/dynamodb'));
app.use(ssrf.base, require('./vulnerabilities/ssrf'));
app.use(unsafeFileUpload.base, require('./vulnerabilities/unsafeFileUpload'));

// adding current year for footer to be up to date
app.locals.navRoutes = navRoutes;
app.locals.currentYear = new Date().getFullYear();

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/quit', function(req, res) {
  res.send('adieu, cherie');
  process.exit(); // eslint-disable-line
});

const port = process.env.PORT || 3000;
const isHttp = process.env.SSL !== '1' ? true : false;
const listener = function listener() {
  const stop = Date.now();
  /* eslint-disable no-console */
  console.log(`startup time: ${stop - start}`);
  console.log(
    'Server listening on %s://localhost:%d',
    isHttp ? 'http' : 'https',
    this.address().port
  );
};

/* Start Server based on protocol */
isHttp
  ? http.createServer(app).listen(port, listener)
  : pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
      if (err) {
        throw err;
      }
      https
        .createServer({ key: keys.serviceKey, cert: keys.certificate }, app)
        .listen(port, listener);
    });
