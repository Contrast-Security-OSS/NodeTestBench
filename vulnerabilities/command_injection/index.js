var express = require('express');
var childProcess = require('child_process');

module.exports = (function() {
	'use strict';
	var api = express.Router();

	api.get('/', function(req, res) {
		res.render('../vulnerabilities/command_injection/views/index');
	});

	api.get('/childprocess_exec', function(req, res) {
		// this should be tainted
		var path = req.query.user_path;

		var ls = 'ls -l ';

		// propagation from path with concat of ls to new var cmd
		var cmd = ls + path;

		// trigger command injection
		childProcess.exec(cmd, function(err, data) {
			res.send('<xmp>' + data);
		});
	});

	api.get('/childprocess_exec_protect', function(req, res) {
		// this should be tainted
		var path = req.query.user_path;

		var ls = 'ls -l ';

		// propagation from path with concat of ls to new var cmd
		var cmd = ls + path;

		// trigger command injection
		childProcess.exec(cmd, function(err, data) {
			res.send('<xmp>' + data);
		});
	});

	return api;
})();
