var _fn          = require('lodash/fp');
var serialize    = require('node-serialize').serialize;
var unserialize  = require('node-serialize').unserialize;

// routes for:  /serialization/*
module.exports = (function ( router ) {

	var COOKIE_UN    = 'name';
	var VIEWS_PREFIX = '../vulnerabilities/serialization/views';

	var pathForView = _fn.replace(/:view/, _fn, VIEWS_PREFIX + '/:view');


	var cookieParser = require('cookie-parser')();
	router.use(cookieParser);

	router.get('/node-serialize', function ( req, res ) {
		return _fn.path(['cookies', COOKIE_UN], req) ?
			res.redirect('/serialization/node-serialize/hello') :
			res.render(pathForView('node-serialize-index'));
	});

	router.post('/node-serialize', function ( req, res ) {
		setCookieValue(res, COOKIE_UN, { name: req.body.name });
		res.redirect('/serialization/node-serialize/hello');
	});

	router.post('/node-serialize/bye', function ( req, res ) {
		res.clearCookie(COOKIE_UN);
		res.redirect('/serialization/node-serialize');
	});

	router.get('/node-serialize/hello', function ( req, res ) {
		var user = getCookieValue(req, COOKIE_UN);
		return user ?
			res.render(pathForView('node-serialize-hello'), user) :
			res.redirect('/serialization/node-serialize');
	});

	router.get('/node-serialize/unserialize', function (req, res) {
		var input = req.query.input;
    var parsed = unserialize(input);
    res.send(parsed);
	});

	// 404 catch-all
	router.use(function ( _, res ) {
		return four04(res);
	});

	return router;

	// -- local fns ----------------------------------------

	function setCookieValue ( res, name, data ) {
		res.cookie(name, makeCookie(data || ''));
		return res;
	}

	function getCookieValue ( req, name ) {
		return req.cookies[name] ?
			unmakeCookie(req.cookies[name]) :
			null;
	}

	function makeCookie ( data ) {
		return encodeURIComponent(serialize(data));
	}

	function unmakeCookie ( cookie ) {
		return unserialize(decodeURIComponent(cookie));
	}

	function four04 ( res ) {
		res.status = 404;
		res.send('404: Not Found');
	}

}(require('express').Router()));
