import _ from 'lodash';
import Api from '../core/ApiClient';
import Notify from '../core/Notify';

import Events from '../Events';
import CollectionStore from './CollectionStore';

import RoleActions from '../actions/RoleActions';
import NotificationActions from '../actions/NotificationActions';

class RoleStore extends CollectionStore {
	getId(item) {
		return item.id;
	}

	getSortValue(item) {
		return item.name;
	}

	getFilter(query) {
		return function(item) {
			return item.name.toUpperCase().indexOf(query.toUpperCase()) >= 0 
				|| item.description.toUpperCase().indexOf(query.toUpperCase()) >= 0;
		};
	}

	getName(id) {
		return this.tryGet(id).name;
	}

	handleAction(action) {
		switch (action.type) {
			// Load the roles.
			case Events.LOAD_ROLES:
				Notify('roles.load', Api.getRoles(action.role))
					.then((data) => {
						RoleActions.loaded(data.roles);
					});
				break;

			// Roles have been loaded, update the store.
			case Events.ROLES_LOADED:
				if (action.roles) {
					this.setAll(action.roles);
					this.emitChange();
				}
				break;

			// Save the role.
			case Events.SAVE_ROLE:
				Notify('role.save', Api.saveRole(action.role))
					.then((data) => {
						RoleActions.saved(data);
					});
				break;

			// Role saved.
			case Events.ROLE_SAVED:
				if (action.role) {
					this.set(action.role);
					this.emitChange();
				}
				break;

			// Add the role permissions.
			case Events.ADD_ROLE_PERMISSIONS:
				Notify('role_permissions.add', Api.addRolePermissions(action.role, action.permissions))
					.then((data) => {
						RoleActions.saved(data);
					});
				break;

			// Delete the role permission.
			case Events.DELETE_ROLE_PERMISSION:
				Notify('role_permission.delete', Api.deleteRolePermission(action.role, action.permission))
					.then((data) => {
						RoleActions.saved(data);
					});
				break;

			// Add the subrole.
			case Events.ADD_ROLE_SUBROLES:
				var matchingSubRole = action.subRoles.indexOf(action.role.id);
				if (matchingSubRole > -1) {
					NotificationActions.warn('You cannot add the same role as a sub role.', 3000);
					return;
				}

				Notify('role_subrole.add', Api.addRoleSubRoles(action.role, action.subRoles))
					.then((data) => {
						RoleActions.saved(data);
					});
				break;

			// Delete the subrole.
			case Events.DELETE_ROLE_SUBROLE:
				Notify('role_subrole.delete', Api.deleteRoleSubRole(action.role, action.subRole))
					.then((data) => {
						RoleActions.saved(data);
					});
				break;

			// Delete the role.
			case Events.DELETE_ROLE:
				Notify('role.delete', Api.deleteRole(action.role))
					.then((data) => {
						RoleActions.deleted(action.role);
					});
				break;

			// Role deleted.
			case Events.ROLE_DELETED:
				if (action.role) {
					this.delete(action.role);
					this.emitChange();
				}
				break;

			// User logged out
			case Events.USER_LOGGED_OUT:
				this.clear();
				this.emitChange();
				break;
			default:
		}
	}
}

export default new RoleStore();