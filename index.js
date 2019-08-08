'use strict';

const start = Date.now();
const express = require('express');
const bodyParser = require('body-parser');

const http = require('http');
const https = require('https');
const pem = require('pem');

const app = express();
const {
  rules,
  routes: {
    cmd_injection,
    path_traversal,
    sqli,
    ssjs,
    ssrf,
    unsafe_file_upload,
    xxe
  }
} = require('@contrast/test-bench-utils');

rules.static();

app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use('/xss_test', require('./vulnerabilities/xss/'));
app.use(sqli.base, require('./vulnerabilities/sqli/'));
app.use(cmd_injection.base, require('./vulnerabilities/command_injection/'));
app.use('/crypto', require('./vulnerabilities/crypto/'));
app.use('/parampollution', require('./vulnerabilities/parampollution/'));
app.use(
  '/unvalidated-redirect',
  require('./vulnerabilities/unvalidated-redirect/')
);
app.use(path_traversal.base, require('./vulnerabilities/path-traversal/'));
app.use('/header-injection', require('./vulnerabilities/header-injection/'));
app.use(
  '/csp-header-insecure',
  require('./vulnerabilities/csp-header-insecure')
);
app.use('/config', require('./vulnerabilities/config/'));
app.use('/serialization', require('./vulnerabilities/serialization'));
app.use(ssjs.base, require('./vulnerabilities/ssjs-injection'));
app.use(xxe.base, require('./vulnerabilities/xxe'));
app.use('/mongoose', require('./vulnerabilities/mongoose'));
app.use('/typecheck', require('./vulnerabilities/typecheck'));
app.use('/mongoose', require('./vulnerabilities/mongoose'));
app.use('/express-session', require('./vulnerabilities/express-session'));
app.use('/ddb', require('./vulnerabilities/dynamodb'));
app.use(ssrf.base, require('./vulnerabilities/ssrf'));
app.use(
  unsafe_file_upload.base,
  require('./vulnerabilities/unsafe-file-upload')
);

// adding current year for footer to be up to date
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
const listener = () => {
  const stop = Date.now();
  /* eslint-disable */
  console.log(`startup time: ${stop - start}`);
  console.log(
    `example app listening on port ${port}${isHttp ? '' : ', securely.'}`
  );
  /* eslint-enable */
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
