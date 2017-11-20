'use strict';

const express = require('express');
const path    = require('path');
const vm      = require('vm');

const viewFilePath = path.resolve(__dirname, './views/index');
const api = express.Router();

api.get('/', function (req, res) {
	res.render(viewFilePath);
});

api.use('/eval/unsafe', ( req, res ) => {
	console.log('eval'); // eslint-disable-line

	const input = getInput(req);
	const data = eval(`({ name: '${input}'})`);

	res.send('<xmp>' + data.name);
});

api.use('/function/unsafe', ( req, res ) => {
	console.log('Function'); // eslint-disable-line

	const input = getInput(req);
	const data = Function(`return { name: '${input}'};`)();
	res.send('<xmp>' + data.name);
});

api.use('/vm-run-in-context/unsafe', ( req, res ) => {
	console.log('vm.runInContext'); // eslint-disable-line

	const input = getInput(req);
	const sb   = { name: '', process };
	const ctx  = vm.createContext(sb);
	vm.runInContext(`name = ${input};`, ctx);
	
	res.send('<xmp>' + sb.name);
});

api.use('/vm-run-in-new-context/unsafe', ( req, res ) => {
	console.log('vm.runInNewContext'); // eslint-disable-line

	const input = getInput(req);
	const sb   = { name: '', process };
	vm.runInNewContext(`name = ${input};`, sb);
	
	res.send('<xmp>' + sb.name);
});

api.use('/vm-run-in-this-context/unsafe', ( req, res ) => {
	console.log('vm.runInThisContext'); // eslint-disable-line

	const input = getInput(req);
	global.name = '';
	vm.runInThisContext(`name = ${input};`);
	res.send('<xmp>' + global.name);

	delete global.name;
});

api.use('/vm-create-context/unsafe', ( req, res ) => {
	console.log('vm.createContext'); // eslint-disable-line

	const input = getInput(req);
	const sb = { name: input, process };
	const ctx = vm.createContext(sb);
	vm.runInContext('name = "matt " + name;', ctx);

	res.send('<xmp>' + sb.name);
});

api.use('/vm-script/unsafe', ( req, res ) => {
	console.log('vm.Script.runInContext'); // eslint-disable-line

	const input = getInput(req);
	const sb = { name: '', process };
	const script = new vm.Script(`name = ${input};`);
	script.runInNewContext(sb);

	res.send('<xmp>' + sb.name);
});

api.use('/vm-script-run-in-context/unsafe', ( req, res ) => {
	console.log('vm.Script.runInContext'); // eslint-disable-line

	const input = getInput(req);
	const sb = { name: '', process };
	const ctx = vm.createContext(sb);
	const script = new vm.Script(`name = ${input};`);

	script.runInContext(ctx);

	res.send('<xmp>' + sb.name);
});

api.use('/vm-script-run-in-new-context/unsafe', ( req, res ) => {
	console.log('vm.Script.runInNewContext'); // eslint-disable-line

	const input = getInput(req);
	const sb = { name: '', process };
	new vm.Script(`name = ${input};`).runInNewContext(sb);

	res.send('<xmp>' + sb.name);
});

api.use('/vm-script-run-in-this-context/unsafe', ( req, res ) => {
	console.log('vm.Script.runInThisContext'); // eslint-disable-line

	const input = getInput(req);
	global.name = '';
	new vm.Script(`name = ${input};`).runInThisContext();
	res.send('<xmp>' + global.name);

	delete global.name;
});

module.exports = api;

function getInput ( req, key ) {
	key = key || 'input';
	return 0 <= [
		'put',
		'post'].indexOf(req.method.toLowerCase()) ?
		req.body[key] :
		req.query[key];
}
