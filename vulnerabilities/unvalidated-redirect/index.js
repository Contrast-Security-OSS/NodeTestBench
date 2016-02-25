var express = require('express');
var childProcess = require('child_process');
var crypto = require('crypto');

module.exports = (function() {
    'use strict';
    var api = express.Router();

    api.get('/', function(req, res) {
		res.render('../vulnerabilities/unvalidated-redirect/views/index');
    });

    api.get('/redir', function(req, res) {
        var path = req.query.user_path;
		//path = encodeURIComponent(path);
        res.redirect(path);
    });

    return api;
})();