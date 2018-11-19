'use strict';
const sqlite3 = require('sqlite3');
const express = require('express');
const db = new sqlite3.Database(':memory:');

let tableExists = false;
module.exports = (function() {
  'use strict';
  var api = express.Router();
  api.get('/', (req, res) => {
    res.render(__dirname + '/../views/sqlite3.ejs');
  });
  api.get('/sqli', (req, res) => {
    db.serialize(function() {
      if (!tableExists) {
	db.run('CREATE TABLE foo (num)');
	tableExists = true;
      }
      db.run('INSERT INTO foo VALUES (?)', [req.query.input], function() {
	db.get('select * from foo', function(err, rows) {
	  if (err) {
	    res.send(err);
	  } else {
	    res.send(req.query.input);
	  }
	});
      });
    });
  });

  return api;
})();
