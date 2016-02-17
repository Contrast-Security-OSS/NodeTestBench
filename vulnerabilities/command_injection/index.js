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

	api.get('/param_test/:input', function(req, res) {
		res.set('X-XSS-Protection', '0'); // disable browser xss protection for chrome
		var output = "<html>param: " + req.params.input + "</html>"
		// this should trigger XSS 
		res.send(output);
	});

	api.post('/xss_post', function (req, res, next) {
		res.set('X-XSS-Protection', '0'); // disable browser xss protection for chrome
		var input = req.body.email;
		var output = "<html>e-mail: " + input + "</html>"
		console.log(output.__contrastProperties);
		res.send(output);
	});
	
    return api;
})();