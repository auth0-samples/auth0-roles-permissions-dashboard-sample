var nconf = require('nconf');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var mongoose = require('mongoose');
var uuid = require('uuid');
var request = require('request');
import logger from './logger';

var permissionSchema = new mongoose.Schema({
  "name" : String,
  "description" : String,
  "application" : String,
  "id" : String
}, {
  id: false 
});
var Permission = mongoose.model('Permission', permissionSchema);

var roleSchema = new mongoose.Schema({
  "name" : String,
  "description" : String,
  "id" : String,
  "application" : String,
  "permissions" : [String],
  "sub_roles" : [String]
}, {
  id: false
});
var Role = mongoose.model('Role', roleSchema);

class SettingsDBService {

  constructor(options) {
    options = options || {};
    
    mongoose.connect(nconf.get('MONGODB_CONNECTION_STRING'));
    this.db = mongoose.connection;
    this.db.on('error', function (err) {
      logger.error('MongoDB connection error', err);
    });
  }

  getPermissions() {
    return new Promise((resolve, reject) => {
      Permission.find(function(err, permissions) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(permissions);
        }
      });
    }).then((permissions) => {
      return permissions;
    });
  }

  savePermission(permission) {
    return new Promise((resolve, reject) => {
      Permission.findOne({ 'id' : permission.id }, function(err, result) {
        if (err) {
          logger.error(err);
        }

        var id = uuid.v4();
        if (result != null) {
          // Update
          result.name = permission.name;
          result.description = permission.description;
          result.application = permission.application;

          result.save((err) =>{
            if (err) {
              logger.error(err);
              reject(err);
            }
            else
              resolve(result);
          });
        }
        else {
          // Create
          var permissionDocument = new Permission({
            "name" : permission.name,
            "description" : permission.description,
            "application" : permission.application,
            "id" : id
          });
          permissionDocument.save((err) => {
            if (err)
              logger.error(err);
            else
              resolve(permissionDocument);
          });
        }
      });
    }).then((permissionDocument) => {
      return permissionDocument;
    });
  }

  deletePermission(permission_id) {
    return new Promise((resolve, reject) => {
      Permission.remove({ 'id' : permission_id }, function(err, result) {
        if (err) { logger.error(err); reject(err); }
        resolve(result);
      });
    }).then((permissions) => {
      return permissions;
    });
  }

  getRoles() {
    return new Promise((resolve, reject) => {
      Role.find(function(err, roles) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(roles);
        }
      });
    }).then((roles) => {
      return roles;
    });
  }

  getFlatPermissions(roles) {
    return this.getPermissions()
      .then((permissions) => {
        let permissions_flat = [];

        // Process the user's roles.
        _.forEach(roles, (role) => {
          _.forEach(permissions, (permission) => {
            if (permissions_flat.indexOf(permission.id) === -1) {
              if (role.permissions && role.permissions.indexOf(permission.id) > -1) {
                permissions_flat.push(permission.id);
              }
            }
          });
        });

        // Return a list of role objects.
        return _.chain(permissions_flat)
          .map((permission_id) => {
            return _.find(permissions, { 'id': permission_id });
          })
          .filter((permission) => { 
            return permission != null;
          })
          .value();
      });
  }

  getFlatRoles(id_list) {
    return this.getRoles()
      .then((roles) => {
        
        // This contains a flat list of all roles and sub roles that apply to the id_list
        let roles_flat = [];

        // Recursive method to find roles.
        let findRoles = (role_id) => {
          logger.log('Finding roles for: ' + role_id);

          // Only process each role once.
          if (roles_flat.indexOf(role_id) === -1) {
            roles_flat.push(role_id);

            // Load the role and add sub roles.
            let role = _.find(roles, { 'id': role_id });
            if (role && role.sub_roles) {
              _.forEach(role.sub_roles, (sub_role_id) => {
                findRoles(sub_role_id);
              });
            }
          }
        };
            logger.info(roles_flat);
            logger.info(roles);

        // Process the user's roles.
        _.forEach(id_list, (role_id) => {
          findRoles(role_id);
        });

        // Return a list of role objects.
        return _.chain(roles_flat)
          .map((role_id) => { 
            return _.find(roles, { 'id': role_id }); 
          })
          .filter((role) => { 
            return role != null && role !== false;
          })
          .value();
      });
  }

  saveRole(role) {
    return new Promise((resolve, reject) => {
      Role.findOne({ 'id' : role.id }, function(err, result) {
        if (err) {
          logger.error(err);
        }
        if (result != null) {
          // Update
          result.name = role.name;
          result.description = role.description;
          result.save((err) =>{
            if (err) {
              logger.error(err);
              reject(err);
            }
            else
              resolve(result);
          });
        }
        else {
          // Create
          var roleDocument = new Role({
            "name" : role.name,
            "description" : role.description,
            "id" : uuid.v4()
          });
          roleDocument.save((err) => {
            if (err)
              logger.error(err);
            else
              resolve(roleDocument);
          });
        }
      });
    }).then((roleDocument) => {
      return roleDocument;
    });
  }

  addRolePermissions(roleId, permissions) {
    return new Promise((resolve, reject) => {
      Role.findOne({ 'id' : roleId }, function(err, role) {
        if (err) {
          logger.error(err); reject(err);
        }
        if (!role.permissions)
          role.permissions = [];

        var new_permissions = _.filter(permissions, function(permission) { 
          return _.indexOf(role.permissions, permission) === -1;
        });

        _.forEach(new_permissions, function(permission) {
          role.permissions.push(permission);
        });

        role.save();
        resolve(role);
      });
    }).then((role) => {
      return role;
    });
  }

  deleteRolePermission(roleId, permissionId) {
    return new Promise((resolve, reject) => {
      Role.findOne({ 'id' : roleId }, function(err, role) {
        if (err) {
          logger.error(err); reject(err);
        }
        if (!role.permissions)
          role.permissions = [];

        var permission_index = role.permissions.indexOf(permissionId);
        if (permission_index > -1) {
          role.permissions.splice(permission_index, 1);
        } 

        role.save();
        resolve(role);
      });
    }).then((role) => {
      return role;
    });
  }

  addRoleSubRoles(roleId, sub_roles) {
    return new Promise((resolve, reject) => {
      Role.findOne({ 'id' : roleId }, function(err, role) {
        if (err) {
          logger.error(err); reject(err);
        }
        if (!role.sub_roles)
          role.sub_roles = [];

        var new_sub_roles = _.filter(sub_roles, function(sub_role) { 
          return _.indexOf(role.sub_roles, sub_role) === -1;
        });

        _.forEach(new_sub_roles, function(sub_role) {
          role.sub_roles.push(sub_role);
        });

        role.save();
        resolve(role);
      });
    }).then((role) => {
      return role;
    });
  }

  deleteRoleSubRole(roleId, sub_role_id) {
    return new Promise((resolve, reject) => {
      Role.findOne({ 'id' : roleId }, function(err, role) {
        if (err) {
          logger.error(err); reject(err);
        }
        if (!role.sub_roles)
          role.sub_roles = [];

        var role_index = role.sub_roles.indexOf(sub_role_id);
        if (role_index > -1) {
          role.sub_roles.splice(role_index, 1);
        } 

        role.save();
        resolve(role);
      });
    }).then((role) => {
      return role;
    });
  }

  deleteRole(role_id) {
    return new Promise((resolve, reject) => {
      Role.remove({ 'id' : role_id }, function(err, result) {
        if (err) { logger.error(err); reject(err); }
        resolve(result);
      });
    }).then((roles) => {
      return roles;
    });
  }
}

module.exports = new SettingsDBService();