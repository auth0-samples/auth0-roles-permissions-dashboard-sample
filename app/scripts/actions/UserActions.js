import Events from '../Events';
import Dispatcher from '../core/AppDispatcher';

class UserActions {
	load() {
		Dispatcher.handleViewAction({ 
			type: Events.LOAD_USERS
		});
	}

	loaded(users) {
		Dispatcher.handleServerAction({ 
			type: Events.USERS_LOADED,
			users: users
		});
	}

	addRoles(user, roles) {
		Dispatcher.handleViewAction({ 
			type: Events.ADD_USER_ROLES,
			user: user,
			roles: roles
		});
	}

	rolesAdded(user, roles) {
		Dispatcher.handleServerAction({ 
			type: Events.USER_ROLES_ADDED,
			user: user,
			roles: roles
		});
	}

	deleteRoles(user, roles) {
		Dispatcher.handleViewAction({ 
			type: Events.DELETE_USER_ROLES,
			user: user,
			roles: roles
		});
	}

	rolesDeleted(user, roles) {
		Dispatcher.handleServerAction({ 
			type: Events.USER_ROLES_DELETED,
			user: user,
			roles: roles
		});
	}
}

export default new UserActions();