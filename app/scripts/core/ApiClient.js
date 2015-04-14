import Events from '../Events';
import Dispatch from './AppDispatcher';
import HttpClient from './HttpClient';
import TokenStore from '../stores/TokenStore';

// Initialize logger.
import { LogFactory } from './Logger';
let logger = LogFactory('api');

class ApiClient {
	constructor() {
		this.http = new HttpClient();

		this.http.onRequest = (req) => {
			// Add the authorization header.
			var token = TokenStore.getToken();
			if (token)
				req.set('Authorization', 'Bearer ' + token);

			// Disable caching.
			if (req.method === 'GET') {
				req.set('X-Requested-With', 'XMLHttpRequest');
				req.set('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1');
			}
		};

		this.http.onError = (res) => {
			if (res && res.unauthorized)
				Dispatch.handleViewAction({ type: Events.USER_LOGGED_OUT });
		};
	}

	getApplications() {
		return this.http.get('/api/apps').promise;
	}

	getUsers() {
		return this.http.get('/api/users').promise;
	}

	addUserRoles(user, roles) {
		return this.http.patch('/api/users/' + user.user_id + '/roles', null, { roles: roles }).promise;
	}

	deleteUserRoles(user, roles) {
		return this.http.del('/api/users/' + user.user_id + '/roles', null, { roles: roles }).promise;
	}
	
	getPermissions() {
		return this.http.get('/api/permissions').promise;
	}

	savePermission(permission) {
		if (permission.id)
			return this.http.put('/api/permissions/' + permission.id, null, permission).promise;
		else
			return this.http.post('/api/permissions', null, permission).promise;
	}

	deletePermission(permission) {
		return this.http.del('/api/permissions/' + permission.id).promise;
	}


	getRoles() {
		return this.http.get('/api/roles').promise;
	}

	saveRole(role) {
		if (role.id)
			return this.http.put('/api/roles/' + role.id, null, role).promise;
		else
			return this.http.post('/api/roles', null, role).promise;
	}

	deleteRole(role) {
		return this.http.del('/api/roles/' + role.id).promise;
	}

	addRolePermissions(role, permissions) {
		return this.http.patch('/api/roles/' + role.id + '/permissions', null, { role: role, permissions: permissions }).promise;
	}

	deleteRolePermission(role, permission) {
		return this.http.del('/api/roles/' + role.id + '/permissions/' + permission.id).promise;
	}

	addRoleSubRoles(role, subRoles) {
		return this.http.patch('/api/roles/' + role.id + '/sub-roles', null, { subRoles: subRoles }).promise;
	}

	deleteRoleSubRole(role, subRole) {
		return this.http.del('/api/roles/' + role.id + '/sub-roles/' + subRole.id).promise;
	}
}

export default new ApiClient();