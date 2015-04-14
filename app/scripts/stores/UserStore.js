import _ from 'lodash';
import Api from '../core/ApiClient';
import Notify from '../core/Notify';

import Events from '../Events';
import CollectionStore from './CollectionStore';

import UserActions from '../actions/UserActions';
import NotificationActions from '../actions/NotificationActions';

class UserStore extends CollectionStore {
	getId(item) {
		return item.user_id;
	}

	getSortValue(item) {
		var user_roles = ((item.app_metadata || {}).roles || []);
		return -user_roles.length;
	}

	getFilter(query) {
		return function(item) {
			return item.name.toUpperCase().indexOf(query.toUpperCase()) >= 0 
				|| item.email.toUpperCase().indexOf(query.toUpperCase()) >= 0 
				|| item.identities[0].connection.toUpperCase().indexOf(query.toUpperCase()) >= 0;
		};
	}

	handleAction(action) {
		switch (action.type) {
			// Load the users.
			case Events.LOAD_USERS:
				Notify('users.load', Api.getUsers())
					.then((data) => {
						UserActions.loaded(data);
					});
				break;

			// Users have been loaded, update the store.
			case Events.USERS_LOADED:
				if (action.users) {
					this.setAll(action.users);
					this.emitChange();
				}
				break;

			// Add the user roles.
			case Events.ADD_USER_ROLES:
				Notify('user_roles.add', Api.addUserRoles(action.user, action.roles))
					.then((data) => {
						UserActions.rolesAdded(action.user, action.roles);
					});
				break;

			// Roles added to user.
			case Events.USER_ROLES_ADDED:
				var user = this.get(action.user.user_id);
				if (!user.app_metadata)
					user.app_metadata = {};
				if (!user.app_metadata.roles) 
					user.app_metadata.roles = [];
				_.forEach(action.roles, function(r) {
					if (user.app_metadata.roles.indexOf(r) === -1)
						user.app_metadata.roles.push(r);
				});
				this.set(user);
				this.emitChange();
				break;

			// Delete the user role.
			case Events.DELETE_USER_ROLES:
				Notify('user_roles.delete', Api.deleteUserRoles(action.user, action.roles))
					.then((data) => {
						UserActions.rolesDeleted(action.user, action.roles);
					});
				break;

			// Roles deleted from user.
			case Events.USER_ROLES_DELETED:
				var user = this.get(action.user.user_id);
				if (!user.app_metadata)
					user.app_metadata = {};
				if (!user.app_metadata.roles) 
					user.app_metadata.roles = [];
				user.app_metadata.roles = _.filter(user.app_metadata.roles, function(r) {
					return action.roles.indexOf(r) === -1;
				});
				this.set(user);
				this.emitChange();
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

export default new UserStore();