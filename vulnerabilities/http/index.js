var express = require('express');

module.exports = (function() {
	'use strict';
	var api = express.Router();

	api.all('/', function(req, res) {
		res.render('../vulnerabilities/http/views/index');
	});

	api.all('/hpp', function(req, res) {
		res.render('../vulnerabilities/http/views/index');
	});

	return api;
})();
