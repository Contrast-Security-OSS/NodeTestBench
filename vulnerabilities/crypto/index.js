const express = require('express');
const crypto = require('crypto');

module.exports = (function() {
  'use strict';
  const api = express.Router();

  api.get('/', function(req, res) {
    res.render('../vulnerabilities/crypto/views/index');
  });

  api.get('/crypto-bad-mac', function(req, res) {
    // this should be tainted
    const shasum = crypto.createHash('md5');
    shasum.update('test');
    const value = shasum.digest('hex');

    res.render('../vulnerabilities/crypto/views/index', {
      crypto_type: 'crypto-bad-mac',
      crypto_value: value
    });
  });

  api.get('/crypto-bad-ciphers', function(req, res) {
    // this should be tainted

    const key = Buffer.alloc(32);
    const iv = Buffer.alloc(8);
    const cipher = crypto.createCipheriv('rc2', key, iv);
    cipher.update('woot', 'utf8', 'base64');
    const value = cipher.final('base64');

    res.render('../vulnerabilities/crypto/views/index', {
      crypto_type: 'crypto-bad-ciphers',
      crypto_value: value
    });
  });

  api.get('/crypto-weak-random', function(req, res) {
    // this should be tainted
    const value = Math.random(100);
    res.render('../vulnerabilities/crypto/views/index', {
      crypto_type: 'crypto-weak-random',
      crypto_value: value
    });
  });

  return api;
})();
