var nconf = require('nconf');
var _ = require('lodash');
var db = require("../db");
var auth = require("../auth");
var logger = require("../logger");
var request = require('request');

module.exports = function(app) {
	app.get('/api/config', function(req, res, next) {
		res.json({
			auth0Domain: nconf.get('AUTH0_DOMAIN'),
			auth0ClientId: nconf.get('AUTH0_CLIENT_ID')
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

	app.get('/api/apps', function(req, res) {

		request({
			url: 'https://' + nconf.get('AUTH0_DOMAIN') + '/api/v2/clients?fields=name,client_id',
			json: true,
			headers: {
				'Authorization': 'Bearer ' + nconf.get('AUTH0_APIV2_TOKEN')
			}
		}, function(error, response, body) {
			
			if (error || response.statusCode !== 200) {
				logger.error(response.statusCode, body);
				res.sendStatus(500);
				return;
			}
		  	res.json(body);
		});
	});

	app.get('/api/users', function(req, res) {

		request({
			url: 'https://' + nconf.get('AUTH0_DOMAIN') + '/api/v2/users',
			json: true,
			headers: {
				'Authorization': 'Bearer ' + nconf.get('AUTH0_APIV2_TOKEN')
			}
		}, function(error, response, body) {
			
			if (error || response.statusCode !== 200) {
				logger.error(response.statusCode, body);
				res.sendStatus(500);
				return;
			}
		  	res.json(body);
		});
	});

	app.patch('/api/users/:id/roles', function(req, res) {
		request({
			url: 'https://' + nconf.get('AUTH0_DOMAIN') + '/api/v2/users/' + req.params.id,
			json: true,
			headers: {
				'Authorization': 'Bearer ' + nconf.get('AUTH0_APIV2_TOKEN')
			}
		}, function(error, response, body) {
			
			if (error || response.statusCode !== 200) {
				logger.error(response.statusCode, body);
				res.sendStatus(500);
				return;
			}

			var user = body;
			var app_metadata = user.app_metadata || {};
			var roles = app_metadata.roles || [];

			_.forEach(req.body.roles, (r) => {
				if (roles.indexOf(r) == -1) {
					roles.push(r);
				}
			});

			request({
				url: 'https://' + nconf.get('AUTH0_DOMAIN') + '/api/v2/users/' + req.params.id,
				json: { 
					app_metadata: {
						roles: roles
					}
				},
				method: 'PATCH',
				headers: {
					'Authorization': 'Bearer ' + nconf.get('AUTH0_APIV2_TOKEN')
				}
			}, function(error, response, body) {
				
				if (error || response.statusCode !== 200) {
					logger.error(response.statusCode, body);
					res.sendStatus(500);
					return;
				}
			  	res.json(body);
			});
		});

	});

	app.delete('/api/users/:id/roles', function(req, res) {
		request({
			url: 'https://' + nconf.get('AUTH0_DOMAIN') + '/api/v2/users/' + req.params.id,
			json: true,
			headers: {
				'Authorization': 'Bearer ' + nconf.get('AUTH0_APIV2_TOKEN')
			}
		}, function(error, response, body) {
			
			if (error || response.statusCode !== 200) {
				logger.error(response.statusCode, body);
				res.sendStatus(500);
				return;
			}

			logger.info('Deleting roles:', req.body.roles);

			var user = body;
			var app_metadata = user.app_metadata || {};
			var roles = app_metadata.roles || [];

			_.forEach(req.body.roles, (r) => {
				var role_index = roles.indexOf(r);
				if (role_index > -1) {
					roles.splice(role_index, 1);
				}
			});

			logger.info('Remaining roles:', roles);

			request({
				url: 'https://' + nconf.get('AUTH0_DOMAIN') + '/api/v2/users/' + req.params.id,
				json: { 
					app_metadata: {
						roles: roles
					}
				},
				method: 'PATCH',
				headers: {
					'Authorization': 'Bearer ' + nconf.get('AUTH0_APIV2_TOKEN')
				}
			}, function(error, response, body) {
				
				if (error || response.statusCode !== 200) {
					logger.error(response.statusCode, body);
					res.sendStatus(500);
					return;
				}
			  	res.json(body);
			});
		});

	});
};