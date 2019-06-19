const express = require('express');

module.exports = (function() {
  'use strict';
  const api = express.Router();

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/header-injection/views/index');
  });

  api.get('/go', function(req, res) {
    // prevent cache
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', 0);

    const path = req.query.user_path;
    //console.log(path);
    //res.writeHead(302, { "Location": path });
    res.header('TEST', path);
    res.send(
      'This did not work. Try with a version older than Node.js 0.8.20.'
    );
  });

  return api;
})();
