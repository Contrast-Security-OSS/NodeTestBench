'use strict';
const express = require('express');
const api = express.Router();

api.use('/url', require('./routes/url.js'));
api.use('/stream', require('./routes/stream.js'));
api.use('/crypto', require('./routes/crypto'));
api.use('/path', require('./routes/path'));
api.use('/sqlite3', require('./routes/sqlite3'));
api.use('/querystring', require('./routes/querystring'));
module.exports = api;
