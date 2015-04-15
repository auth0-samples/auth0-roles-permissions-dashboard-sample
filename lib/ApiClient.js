import nconf from 'nconf';
import request from 'request';
import logger from './logger';

class ApiClient {

	getApplications() {
		return new Promise((resolve, reject) => {
			request({
				url: 'https://' + nconf.get('AUTH0_DOMAIN') + '/api/v2/clients?fields=name,client_id',
				json: true,
				headers: {
					'Authorization': 'Bearer ' + nconf.get('AUTH0_APIV2_TOKEN')
				}
			}, function(error, response, body) {
				if (error || response.statusCode !== 200) {
					if (error) {
						logger.error(response.statusCode, error);
						return reject(error);
					} else {
						logger.error(response.statusCode, body);
						return reject('Error calling the Auth0 API. Status code: ' + response.statusCode);
					}
				} else {
					resolve(body)
				}
			});
		});
	}

	getUsers() {
		return new Promise((resolve, reject) => {
			request({
				url: 'https://' + nconf.get('AUTH0_DOMAIN') + '/api/v2/users',
				json: true,
				headers: {
					'Authorization': 'Bearer ' + nconf.get('AUTH0_APIV2_TOKEN')
				}
			}, function(error, response, body) {
				if (error || response.statusCode !== 200) {
					if (error) {
						logger.error(response.statusCode, error);
						return reject(error);
					} else {
						logger.error(response.statusCode, body);
						return reject('Error calling the Auth0 API. Status code: ' + response.statusCode);
					}
				} else {
					resolve(body)
				}
			});
		});
	}

	getUser(user_id) {
		return new Promise((resolve, reject) => {
			request({
				url: 'https://' + nconf.get('AUTH0_DOMAIN') + '/api/v2/users/' + user_id,
				json: true,
				headers: {
					'Authorization': 'Bearer ' + nconf.get('AUTH0_APIV2_TOKEN')
				}
			}, function(error, response, body) {
				if (error || response.statusCode !== 200) {
					if (error) {
						logger.error(response.statusCode, error);
						return reject(error);
					} else {
						logger.error(response.statusCode, body);
						return reject('Error calling the Auth0 API. Status code: ' + response.statusCode);
					}
				} else {
					resolve(body)
				}
			});
		});
	}

	updateUserAppMetadata(user_id, metadata) {
		return new Promise((resolve, reject) => {
			request({
				url: 'https://' + nconf.get('AUTH0_DOMAIN') + '/api/v2/users/' + user_id,
				json: { 
					app_metadata: metadata
				},
				method: 'PATCH',
				headers: {
					'Authorization': 'Bearer ' + nconf.get('AUTH0_APIV2_TOKEN')
				}
			}, function(error, response, body) {
				if (error || response.statusCode !== 200) {
					if (error) {
						logger.error(response.statusCode, error);
						return reject(error);
					} else {
						logger.error(response.statusCode, body);
						return reject('Error calling the Auth0 API. Status code: ' + response.statusCode);
					}
				} else {
					resolve(body)
				}
			});
		});
	}
}

export default new ApiClient();