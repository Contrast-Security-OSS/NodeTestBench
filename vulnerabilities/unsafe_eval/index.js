var express = require('express');
// var childProcess = require('child_process');

module.exports = (function () {
	'use strict';
	var api = express.Router();

	api.get('/', function (req, res) {
		res.render('../vulnerabilities/unsafe_eval/views/index');
	});

	api.get('/unsafe', function (req, res) {
		// this should be tainted
		var input = req.query.name;
		var data = '{name:"' + input + '"}';
		data = eval(data);
		res.send('<xmp>' + data);
	});

	return api;
})();
