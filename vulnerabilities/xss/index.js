var express = require('express');

module.exports = (function () {
    'use strict';
    var api = express.Router();

    api.get('/', function (req, res) {
		res.render('../vulnerabilities/xss/views/index');
    });

    api.get('/query_string', function (req, res) {
		res.set('X-XSS-Protection', '0'); // disable browser xss protection for chrome
		// taint user input 
		var input = req.query.input;
		var output = "<html>input: " + input + "</html>"
		// this should trigger XSS 
		res.send(output);
    });

	api.get('/param_test/:input', function (req, res) {
		res.set('X-XSS-Protection', '0'); // disable browser xss protection for chrome
		var output = "<html>param: " + req.params.input + "</html>"

		console.log(req.url);
		// this should trigger XSS 
		res.send(output);
	});

	api.post('/xss_post', function (req, res, next) {
		res.set('X-XSS-Protection', '0'); // disable browser xss protection for chrome
		var input = req.body.email;
		var output = "<html>e-mail: " + input + "</html>"
		res.send(output);
	});

    return api;
})();