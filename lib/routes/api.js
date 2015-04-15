var nconf = require('nconf');
var _ = require('lodash');
var db = require("../db");
var auth = require("../auth");
var logger = require("../logger");
var request = require('request');

import ApiClient from '../ApiClient';

module.exports = function(app) {
	app.get('/api/config', function(req, res, next) {
		res.json({
			auth0Domain: nconf.get('AUTH0_DOMAIN'),
			auth0ClientId: nconf.get('AUTH0_CLIENT_ID')
		});
	});

	/*
	 * Get a list of permissions for a set of roles.
	 */
	app.get('/api/permissions', (req, res) => {
		// Get the user's roles.
		var user_roles = req.body.roles;

		// Get roles and permissions.
		db.getFlatRoles(user_roles).then((roles) => {
			return db.getFlatPermissions(roles).then((permissions) => {
				res.json({
					permissions: permissions
				});
			}).catch(err => {
				logger.error(err);
				res.sendStatus(500);
			});
		}).catch(err => {
			logger.error(err);
			res.sendStatus(500);
		});
	});

	app.use('/api', auth.authenticate);

	app.get('/api/permissions', function(req, res) {
		db.getPermissions()
			.then((perm) => {
				res.json({
					permissions: perm
				});
			}).catch(err => {
				logger.error(err);
				res.sendStatus(500);
			});
	});

	app.post('/api/permissions', function(req, res) {
		db.savePermission(req.body).then((perm) => {
			res.json(perm);
		}).catch(err => {
			logger.error(err);
			res.sendStatus(500);
		});
	});

	app.put('/api/permissions/:id', function(req, res) {
		db.savePermission(req.body).then((perm) => {
			res.json(perm);
		}).catch(err => {
			logger.error(err);
			res.sendStatus(500);
		});
	});

	app.delete('/api/permissions/:id', function(req, res) {
		db.deletePermission(req.params.id).then(() => {
			res.sendStatus(200);
		}).catch((err) => {
			logger.error(err);
			res.sendStatus(404);
		});
	});



	app.get('/api/roles', function(req, res) {
		db.getRoles()
			.then((roles) => {
				res.json({
					roles: roles
				});
			}).catch(err => {
				logger.error(err);
				res.sendStatus(500);
			});
	});

	app.post('/api/roles', function(req, res) {
		db.saveRole(req.body).then((roles) => {
			res.json(roles);
		}).catch(err => {
			logger.error(err);
			res.sendStatus(500);
		});
	});

	app.put('/api/roles/:id', function(req, res) {
		db.saveRole(req.body).then((roles) => {
			res.json(roles);
		}).catch(err => {
			logger.error(err);
			res.sendStatus(500);
		});
	});

	app.delete('/api/roles/:id', function(req, res) {
		db.deleteRole(req.params.id).then(() => {
			res.sendStatus(200);
		}).catch((err) => {
			logger.error(err);
			res.sendStatus(404);
		});
	});

	app.patch('/api/roles/:id/permissions', function(req, res) {
		db.addRolePermissions(req.params.id, req.body.permissions).then((role) => {
			res.json(role);
		}).catch(err => {
			logger.error(err);
			res.sendStatus(500);
		});
	});

	app.delete('/api/roles/:id/permissions/:permissionId', function(req, res) {
		db.deleteRolePermission(req.params.id, req.params.permissionId).then((role) => {
			res.json(role);
		}).catch(err => {
			logger.error(err);
			res.sendStatus(500);
		});
	});

	app.patch('/api/roles/:id/sub-roles', function(req, res) {
		db.addRoleSubRoles(req.params.id, req.body.subRoles).then((role) => {
			res.json(role);
		}).catch(err => {
			logger.error(err);
			res.sendStatus(500);
		});
	});

	app.delete('/api/roles/:id/sub-roles/:subRoleId', function(req, res) {
		db.deleteRoleSubRole(req.params.id, req.params.subRoleId).then((role) => {
			res.json(role);
		}).catch(err => {
			logger.error(err);
			res.sendStatus(500);
		});
	});

	/*
	 * List all applications coming from the Auth0 API.
	 */
	app.get('/api/apps', (req, res) => {
		ApiClient.getApplications().then(apps => {
			res.json(apps);
		}).catch(err => {
			res.sendStatus(500);
		});
	});

	/*
	 * List all users coming from the Auth0 API.
	 */
	app.get('/api/users', (req, res) => {
		ApiClient.getUsers().then(users => {
			res.json(users);
		}).catch(err => {
			res.sendStatus(500);
		});
	});

	/*
	 * Get a list of the user's effective roles and permissions.
	 */
	app.get('/api/users/:id/effective', (req, res) => {
		// Get the user from Auth0.
		ApiClient.getUser(req.params.id).then(user => {

			// Get the user's roles.
			var user_roles = (user.app_metadata || {}).roles || [];

			// Get roles and permissions.
			db.getFlatRoles(user_roles).then((roles) => {
				return db.getFlatPermissions(roles).then((permissions) => {
					res.json({
						roles: roles,
						permissions: permissions
					});
				}).catch(err => {
					logger.error(err);
					res.sendStatus(500);
				});
			}).catch(err => {
				logger.error(err);
				res.sendStatus(500);
			});
		}).catch(err => {
			res.sendStatus(500);
		});
	});

	/*
	 * Add roles to a user.
	 */
	app.patch('/api/users/:id/roles', function(req, res) {
		// Get the user from Auth0.
		ApiClient.getUser(req.params.id).then(user => {

			var user_roles = (user.app_metadata || {}).roles || [];

			// Add new roles.
			_.forEach(req.body.roles, (r) => {
				if (user_roles.indexOf(r) == -1) {
					user_roles.push(r);
				}
			});

			// Update the user's metadata.
			ApiClient.updateUserAppMetadata(req.params.id, {
				roles: user_roles
			})
			.then((data) => {
				res.json(data);
			})
			.catch(err => {
				res.sendStatus(500);
			});
		}).catch(err => {
			res.sendStatus(500);
		});
	});

	/*
	 * Remove roles from a user.
	 */
	app.delete('/api/users/:id/roles', function(req, res) {
		// Get the user from Auth0.
		ApiClient.getUser(req.params.id).then(user => {

			var user_roles = (user.app_metadata || {}).roles || [];

			// Remove roles.
			_.forEach(req.body.roles, (r) => {
				var role_index = user_roles.indexOf(r);
				if (role_index > -1) {
					user_roles.splice(role_index, 1);
				}
			});

			// Update the user's metadata.
			ApiClient.updateUserAppMetadata(req.params.id, {
				roles: user_roles
			})
			.then((data) => {
				res.json(data);
			})
			.catch(err => {
				res.sendStatus(500);
			});
		}).catch(err => {
			res.sendStatus(500);
		});
	});
};