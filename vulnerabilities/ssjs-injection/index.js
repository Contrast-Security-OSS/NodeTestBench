'use strict';

const F       = require('lodash/fp');
const Express = require('express');
const path    = require('path');
const vm      = require('vm');

module.exports = app => {

	const api = Express.Router();

	/* Prefix routes with rule ID */
	app.use('/ssjs-injection', api);

	/* ########################################################### */
	/* ### Base index HTML page                                ### */
	/* ########################################################### */
	api.get('/', function (req, res) {
		res.render(path.resolve(__dirname, './views/index'));
	});

	/* ########################################################### */
	/* ### Build API routes programmatically                  #### */
	/* ########################################################### */

	/*  Routes:                                                    */
	/*  /ssjs-injection/query/[un]safe/eval                  ,     */
	/*  /ssjs-injection/query/[un]safe/function              ,     */
	/*  /ssjs-injection/query/[un]safe/vm-create-context     ,     */
	/*  /ssjs-injection/query/[un]safe/vm-run-in-context     ,     */
	/*  /ssjs-injection/query/[un]safe/vm-run-in-new-context , ... */

	const inputTypes  = ['body', 'cookies', 'headers', 'params', 'query'];
	const inputSegmentLookup = {
		body    : '/body',
		cookies : '/cookies',
		headers : '/headers',
		params  : '/url-params',
		query   : '/query'
	};

	const makeRouteHandlers = ( sinkSegment, handle ) => {
		inputTypes.forEach(type => {
			const dataPath = `${type}.input`;
			const inputSegment = inputSegmentLookup[type];

			/* Safe */
			api.use(`${inputSegment}/safe${sinkSegment}`, ( req, res ) => {
				return F.compose([
					result => res.send(result),
					input => tryCatch(() => handle(input))
				])('"Safe and trusted"');
			});

			/* Unsafe */
			api.use(`${inputSegment}/unsafe${sinkSegment}`, ( req, res ) => {
				return F.compose([
					result => res.send(result),
					input => tryCatch(() => handle(input)),
					input => input.toString(),
					F.path(dataPath),
				])(req);
			});

		});
	};

	const tryCatch = block => {
		try {
			return block(); }
		catch (error) {
			return [error.message, error.stack].join('\n'); }
	};

	const _Function = input => {
		return Function(input)();
	};

	const vmRunInCtx = input => {
		const sb  = { value: '', process };
		const ctx = vm.createContext(sb);
		vm.runInContext(`value = ${input};`, ctx);

		return sb.value;
	};

	const vmRunInNewCtx = input => {
		const sb = { value: '', process };
		vm.runInNewContext(`value = ${input};`, sb);

		return sb.value;
	};

	const vmRunInThisCtx = input => {
		const epoch = new Date().getTime();
		const name = `value${epoch}`;

		global[name] = '';

		vm.runInThisContext(`${name} = ${input};`);
		setTimeout(() => { delete global[name]; }, 1000);

		return global[name];
	};

	const vmCreateContext = input => {
		throw new Error('Not implemented.');
	};

	const vmScriptRunInCtx = input => {
		const sb = { value: '', process };
		const ctx = vm.createContext(sb);
		const script = new vm.Script(`value = ${input};`);
		script.runInContext(ctx);

		return sb.value;
	};

	const vmScriptRunInNewCtx = input => {
		const sb = { value: '', process };
		const script = new vm.Script(`value = ${input};`);
		script.runInNewContext(sb);

		return sb.value;
	};

	const vmScriptRunInThisCtx = input => {
		const epoch = new Date().getTime();
		const name = `value${epoch}`;

		global[name] = '';

		const script = new vm.Script(`${name} = ${input};`);
		script.runInThisContext();
		setTimeout(() => { delete global[name]; }, 1000);

		return global[name];
	};

	[
		['/eval'                         , eval                ],
		['/function'                     , _Function           ],
		['/vm-run-in-context'            , vmRunInCtx          ],
		['/vm-run-in-new-context'        , vmRunInNewCtx       ],
		['/vm-run-in-this-context'       , vmRunInThisCtx      ],
		['/vm-create-context'            , vmCreateContext     ],
		['/vm-script-run-in-context'     , vmScriptRunInCtx    ],
		['/vm-script-run-in-new-context' , vmScriptRunInNewCtx ],
		['/vm-script-run-in-this-context', vmScriptRunInThisCtx]
	].forEach(
		confArgs => makeRouteHandlers.apply(null, confArgs));

	return api;
};
