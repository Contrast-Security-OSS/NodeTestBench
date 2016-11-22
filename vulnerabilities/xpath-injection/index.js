var express = require('express');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var util = require('util');

var userdata = '<users><user><username>admin</username> <password>admin</password> </user><user> <username>user1</username> <password>123456</password></user> <user><username>tony</username> <password>ynot</password></user> </users> ';

var doc = new dom().parseFromString(userdata);

module.exports = (function() {
	'use strict';
	var api = express.Router();

	api.get('/', function(req, res) {
		res.render(__dirname + '/views/index');
	});

	api.get('/find', function(req, res) {
		var user = xpath.select('//user[username/text()=\'' + req.query.username + '\']', doc);
		res.send(user.toString());
	});
	return api;
})();
