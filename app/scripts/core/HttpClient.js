var request = require('superagent');

// Initialize logger.
import { LogFactory } from './Logger';
let logger = LogFactory('http');

export default class HttpClient {

	get(url, options) {
		return this._createRequest(request.get(url), options, null);
	}
	
	del(url, options, data) {
		return this._createRequest(request.del(url), options, data);
	}

	post(url, options, data) {
		return this._createRequest(request.post(url), options, data);
	}

	patch(url, options, data) {
		return this._createRequest(request.patch(url), options, data);
	}

	put(url, options, data) {
		return this._createRequest(request.put(url), options, data);
	}

	onRequest(req) {

	}

	onError(res) {

	}

	_createRequest(req, options, data) {
		var ret = {};
		ret.req = req;
		ret.promise = new Promise((resolve, reject) => {
			if (options)
				req = req.query(options);
			if (data)
				req = req.send(data);
			this.onRequest(req);
			req.on('abort', () => {
				reject('abort');
			});
			req.use((r) => {
				logger.log(r.method + ': `' + r.url + '`');
			});
			req.end((err, res) => 
				this._handleCallback(err, res, { resolve: resolve, reject: reject}));
		});
		return ret;
	}

	_handleCallback(err, res, deferred) {
		if (err || res.error) {
			if (err.status)
				logger.error('Error making HTTP request. Status: `' + (res.error.message || res.status) + '`');
			else
				logger.error('Error making HTTP request. The server did not reply.');

			this.onError(res);
			deferred.reject(res);
		} else {
			deferred.resolve(res.body || res.text);
		}
	}
}