var express = require('express');
var childProcess = require('child_process');
var crypto = require('crypto');

module.exports = (function() {
    'use strict';
    var api = express.Router();

    api.all('/', function(req, res) {
		res.render('../vulnerabilities/http/views/index');
    });

	api.all('/hpp', function (req, res) {
	    res.render('../vulnerabilities/http/views/index');
	});
	
    return api;
})();