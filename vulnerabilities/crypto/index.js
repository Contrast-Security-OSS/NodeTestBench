var express = require('express');
var childProcess = require('child_process');
var crypto = require('crypto');

module.exports = (function() {
    'use strict';
    var api = express.Router();

    api.get('/', function(req, res) {
		res.render('../vulnerabilities/crypto/views/index');
    });

    api.get('/crypto-bad-mac', function(req, res) {
		// this should be tainted
		var shasum = crypto.createHash('md5');
		shasum.update('test');
		var value = shasum.digest('hex');
		
		res.render('../vulnerabilities/crypto/views/index', {crypto_type: 'crypto-bad-mac',crypto_value: value});
    });
	
    api.get('/crypto-bad-ciphers', function(req, res) {
		// this should be tainted
		
		var cipher = crypto.createCipher('rc2', 'woot');
		cipher.update('woot', 'utf8', 'base64');
		var value = cipher.final('base64');
		
		res.render('../vulnerabilities/crypto/views/index', {crypto_type: 'crypto-bad-ciphers',crypto_value: value});
    });
	
    api.get('/crypto-weak-random', function(req, res) {
		// this should be tainted
		var value = Math.random(100);
		res.render('../vulnerabilities/crypto/views/index', {crypto_type: 'crypto-weak-random',crypto_value: value});
    });
	
    return api;
})();