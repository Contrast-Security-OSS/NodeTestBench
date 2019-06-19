const express = require('express');
const hooker = require('hooker');
const mysql = require('mysql');

const util = require('util');

// mock the sql query so the app does not require a database connection
hooker.hook(require('mysql/lib/Connection').prototype, 'query', {
  post(result, sql, cb) {
    cb(null, [
      {
        query: sql
      }
    ]);
  }
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root'
});

// pretend we already connected
connection._connectCalled = true;

connection.connect();

module.exports = (function() {
  'use strict';
  const api = express.Router();

  api.get('/', function(req, res) {
    res.render(`${__dirname}/views/index`);
  });

  api.get('/mysql', function(req, res) {
    connection.query(`SELECT "${req.query.name}" as "test";`, function(
      error,
      rows,
      fields
    ) {
      res.send(`The solution is: ${util.inspect(rows)}`);
    });
  });
  api.get('/mysql_safe', function(req, res) {
    connection.query('SELECT "' + 'clown' + '" as "test";', function(
      error,
      rows,
      fields
    ) {
      res.send(`The solution is: ${util.inspect(rows)}`);
    });
  });

  return api;
})();
