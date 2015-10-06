var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var uuid = require('uuid');
var request = require('request');
import logger from './logger';

var empty_config = {
  permissions: [],
  roles: []
};

class DBFileService {

  constructor(options) {
    options = options || {};
    this.config = null;
    this.configPath = path.join(__dirname, '../data.json');
  }

  _writeConfig() {
    return new Promise((resolve, reject) => {
      var json = JSON.stringify(this.config, null, 2);
      fs.writeFile(this.configPath, json, function(err) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve();
      })
    });
  }

  _ensureLoaded() {
    return new Promise((resolve, reject) => {
      if (!this.config) {
        fs.exists(this.configPath, (function(exists) {
          if (exists) {
            fs.readFile(this.configPath, (function(err, json) {
              if (err) {
                console.log(err);
                reject(err);
              }
              this.config = JSON.parse(json);
              resolve();
            }).bind(this));
          } else {
            this.config = empty_config;
            this._writeConfig()
            .then(function() {
              resolve();
            });
          }
        }).bind(this));

      } else {
        resolve();
      }
    });
  }

  _getConfig(name) {
    return this._ensureLoaded()
    .then(() => {
      return this.config[name]
    });
  }

  getPermissions() {
    return this._getConfig('permissions');
  }

  savePermission(permission) {
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.permissions, { 'id': permission.id });
      if (i > -1) {
        this.config.permissions[i] = permission;
      } else {
        permission.id = uuid.v4()
        this.config.permissions.push(permission);
      }
    }).then(() => {
      return this._writeConfig();
    }).then(() => {
      return permission;
    })
  }

  deletePermission(permission_id) {
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.permissions, { 'id': permission_id });
      if (i > -1) {
        this.config.permissions.splice(i, 1);
      } else {
        throw 'Invalid permission_id';
      }
    }).then(() => {
      return this._writeConfig();
    });
  }



  getRoles() {
    return this._getConfig('roles');
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
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.roles, { 'id': role.id });
      if (i > -1) {
        this.config.roles[i].name = role.name;
        this.config.roles[i].description = role.description;
        this.config.roles[i].application = role.application;
        role = this.config.roles[i];
      } else {
        role.id = uuid.v4()
        this.config.roles.push(role);
      }
    }).then(() => {
      return this._writeConfig();
    }).then(() => {
      return role;
    })
  }

  addRolePermissions(roleId, permissions) {
    var role;
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.roles, { 'id': roleId });
      role = this.config.roles[i];

      if (!role.permissions) {
        role.permissions = [];
      }

      var new_permissions = _.filter(permissions, function(permission) { 
        return _.indexOf(role.permissions, permission) === -1;
      });

      _.forEach(new_permissions, function(permission) {
        role.permissions.push(permission);
      })
    }).then(() => {
      return this._writeConfig();
    }).then(() => {
      return role;
    })
  }

  deleteRolePermission(roleId, permissionId) {
    var role;
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.roles, { 'id': roleId });
      role = this.config.roles[i];

      if (!role.permissions) {
        role.permissions = [];
      }
      


      var permission_index = role.permissions.indexOf(permissionId);
      if (permission_index > -1) {
        role.permissions.splice(permission_index, 1);
      } 

    }).then(() => {
      return this._writeConfig();
    }).then(() => {
      return role;
    })
  }

  addRoleSubRoles(role_id, sub_roles) {
    var role;
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.roles, { 'id': role_id });
      role = this.config.roles[i];

      if (!role.sub_roles) {
        role.sub_roles = [];
      }

      var new_roles = _.filter(sub_roles, function(r) { 
        return _.indexOf(role.sub_roles, r) === -1;
      });

      _.forEach(new_roles, function(r) {
        role.sub_roles.push(r);
      })
    }).then(() => {
      return this._writeConfig();
    }).then(() => {
      return role;
    })
  }

  deleteRoleSubRole(role_id, sub_role_id) {
    var role;
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.roles, { 'id': role_id });
      role = this.config.roles[i];

      if (!role.sub_roles) {
        role.sub_roles = [];
      }

      var sub_role_index = role.sub_roles.indexOf(sub_role_id);
      if (sub_role_index > -1) {
        role.sub_roles.splice(sub_role_index, 1);
      } 

    }).then(() => {
      return this._writeConfig();
    }).then(() => {
      return role;
    })
  }

  deleteRole(role_id) {
    return this._ensureLoaded()
    .then(() => {
      var i = _.findIndex(this.config.roles, { 'id': role_id });
      if (i > -1) {
        this.config.roles.splice(i, 1);
      } else {
        throw 'Invalid role_id';
      }
    }).then(() => {
      return this._writeConfig();
    });
  }


}

module.exports = new DBFileService();
