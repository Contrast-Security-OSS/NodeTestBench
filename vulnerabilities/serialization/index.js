const _fn = require('lodash/fp');
const { serialize } = require('node-serialize');
const { unserialize } = require('node-serialize');

// routes for:  /serialization/*
module.exports = (function(router) {
  const COOKIE_UN = 'name';
  const VIEWS_PREFIX = '../vulnerabilities/serialization/views';

  const pathForView = _fn.replace(/:view/, _fn, `${VIEWS_PREFIX}/:view`);

  const cookieParser = require('cookie-parser')();
  router.use(cookieParser);

  router.get('/node-serialize', function(req, res) {
    return _fn.path(['cookies', COOKIE_UN], req)
      ? res.redirect('/serialization/node-serialize/hello')
      : res.render(pathForView('node-serialize-index'));
  });

  router.post('/node-serialize', function(req, res) {
    setCookieValue(res, COOKIE_UN, { name: req.body.name });
    res.redirect('/serialization/node-serialize/hello');
  });

  router.post('/node-serialize/bye', function(req, res) {
    res.clearCookie(COOKIE_UN);
    res.redirect('/serialization/node-serialize');
  });

  router.get('/node-serialize/hello', function(req, res) {
    const user = getCookieValue(req, COOKIE_UN);
    return user
      ? res.render(pathForView('node-serialize-hello'), user)
      : res.redirect('/serialization/node-serialize');
  });

  router.get('/node-serialize/unserialize', function(req, res) {
    const { input } = req.query;
    const parsed = unserialize(input);
    res.send(parsed);
  });

  // 404 catch-all
  router.use(function(_, res) {
    return four04(res);
  });

  return router;

  // -- local fns ----------------------------------------

  function setCookieValue(res, name, data) {
    res.cookie(name, makeCookie(data || ''));
    return res;
  }

  function getCookieValue(req, name) {
    return req.cookies[name] ? unmakeCookie(req.cookies[name]) : null;
  }

  function makeCookie(data) {
    return encodeURIComponent(serialize(data));
  }

  function unmakeCookie(cookie) {
    return unserialize(decodeURIComponent(cookie));
  }

  function four04(res) {
    res.status = 404;
    res.send('404: Not Found');
  }
})(require('express').Router());
