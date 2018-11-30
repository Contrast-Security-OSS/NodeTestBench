'use strict';
const express = require('express');
const stream = require('stream');

const push = (r, req, res) => {
  const input = req.query.input;

  try {
    r.push(input);
    res.send(input);
  } catch (err) {
    console.error(err);
    res.send();
  }
};

const write = (w, req, res) => {
  const input = req.query.input;

  try {
    w.write(input);
    res.send(input);
  } catch (err) {
    console.error(err);
    res.send();
  }
};

function nop() {}

const R = new stream.Readable();
R._read = nop;

const W = new stream.Writable();
W._write = nop;

const D = new stream.Duplex();
D._write = nop;
D._read = nop;

const T = new stream.Transform();
T._write = nop;
T._read = nop;

const readable = express.Router();
readable.get('/push', push.bind(this, R));

const writable = express.Router();
writable.get('/write', write.bind(this, W));

const duplex = express.Router();
duplex.get('/push', push.bind(this, D));
duplex.get('/write', write.bind(this, D));

const transform = express.Router();
transform.get('/push', push.bind(this, T));
transform.get('/write', write.bind(this, T));

module.exports = (function() {
  'use strict';
  var api = express.Router();

  api.get('/', function(req, res) {
    res.render(__dirname + '/../views/stream.ejs');
  });

  api.use('/readable', readable);
  api.use('/writable', writable);
  api.use('/duplex', duplex);
  api.use('/transform', transform);

  return api;
})();
