var express = require('express');
var hooker = require('hooker');
var mysql = require('mysql');

var util = require('util');

// mock the sql query so the app does not require a database connection
hooker.hook(require('mysql/lib/Connection').prototype, 'query', {
	pre: function() {
		console.log(arguments[0]);
	},
	post: function(result, sql, cb) {
		cb(null, [{
			query: sql
		}]);
	}
});

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root'
});

// pretend we already connected
connection._connectCalled = true;

connection.connect();


module.exports = (function() {
	'use strict';
	var api = express.Router();

	api.get('/', function(req, res) {
		res.render(__dirname + '/views/index');
	});

	api.get('/mysql', function(req, res) {
		connection.query('SELECT "' + req.query.name + '" as "test";',
			function(error, rows, fields) {
				res.send('The solution is: ' + util.inspect(rows));
			}
		);
	});
	api.get('/mysql_protect', function(req, res) {
		connection.query('SELECT "' + req.query.name + '" as "test";',
			function(error, rows, fields) {
				res.send('The solution is: ' + util.inspect(rows));
			}
		);
	});

	return api;
})();
