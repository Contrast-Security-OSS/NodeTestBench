var express = require('express');

module.exports = (function() {
	'use strict';
	var api = express.Router();

	api.get('/', function(req, res) {
		res.render('../vulnerabilities/config/views/index');
	});

	return api;
})();
