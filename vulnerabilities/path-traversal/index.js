var express = require('express');
var fs = require('fs');

module.exports = (function() {
	'use strict';
	var api = express.Router();

	api.get('/', function(req, res) {
		res.render('../vulnerabilities/path-traversal/views/index');
	});

	api.post('/readFile', function(req, res) {
		var path = req.body.user_path;

		fs.readFile(path, 'utf8', function(err, data) {
			res.send(data);
		});

	});

	api.post('/writeFile', function(req, res) {
		var path = req.body.user_path;

		fs.writeFile(path, function(err) {
			if (err) throw err;
			res.send('It\'s saved!');
		});

	});

	return api;
})();
