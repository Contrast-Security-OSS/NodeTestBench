'use strict';
if (process.env.CONTRAST_NEW_RELIC_KEY) {
  require('newrelic');
}

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
const cookieParser = require('cookie-parser');
const layouts = require('express-ejs-layouts');
const http = require('http');
const https = require('https');
const pem = require('pem');

const app = express();
const { navRoutes } = require('@contrast/test-bench-utils');

require('./vulnerabilities/static');
app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser('keyboard cat'));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(layouts);

// dynamically register routes from shared config
navRoutes.forEach(({ base }) => {
  app.use(base, require(`./vulnerabilities/${base.substring(1)}`));
});
app.use('/crypto', require('./vulnerabilities/crypto'));
app.use('/parampollution', require('./vulnerabilities/parampollution'));
app.use('/header-injection', require('./vulnerabilities/header-injection'));
app.use(
  '/csp-header-insecure',
  require('./vulnerabilities/csp-header-insecure')
);
app.use('/config', require('./vulnerabilities/config'));
app.use('/serialization', require('./vulnerabilities/serialization'));
app.use('/mongoose', require('./vulnerabilities/mongoose'));
app.use('/typecheck', require('./vulnerabilities/typecheck'));
app.use('/mongoose', require('./vulnerabilities/mongoose'));
app.use('/express-session', require('./vulnerabilities/express-session'));
app.use('/ddb', require('./vulnerabilities/dynamodb'));

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
const host = 'localhost';
const listener = function listener() {
  const stop = Date.now();
  /* eslint-disable no-console */
  console.log(`startup time: ${stop - start}`);
  console.log(
    'Server listening on %s://%s:%d',
    isHttp ? 'http' : 'https',
    host,
    this.address().port
  );
};

function createServer() {
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
}

if (process.env.CLUSTER) {
  const cluster = require('cluster');
  const numCPUs = require('os').cpus().length;

  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    createServer();
  }
} else {
  createServer();
}
