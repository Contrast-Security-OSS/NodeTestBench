var express = require('express');
var childProcess = require('child_process');
var crypto = require('crypto');
var fs = require('fs');


module.exports = (function () {
    'use strict';
    var api = express.Router();

    api.get('/', function (req, res) {
		res.render('../vulnerabilities/header-injection/views/index');
    });

    api.get('/go', function (req, res) {
        // prevent cache
		res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);

        var path = req.query.user_path;
        //console.log(path);
		//res.writeHead(302, { "Location": path });
        res.header("TEST", path);
        res.send('This did not work. Try with a version older than Node.js 0.8.20.');
    });

    return api;
})();