import Events from '../Events';
import Dispatcher from '../core/AppDispatcher';

class RoleActions {
	load() {
		Dispatcher.handleViewAction({ 
			type: Events.LOAD_ROLES
		});
	}

	loaded(roles) {
		Dispatcher.handleServerAction({ 
			type: Events.ROLES_LOADED,
			roles: roles
		});
	}

	save(role) {
		Dispatcher.handleViewAction({ 
			type: Events.SAVE_ROLE,
			role: role
		});
	}
	
	saved(role) {
		Dispatcher.handleServerAction({ 
			type: Events.ROLE_SAVED,
			role: role
		});
	}

	addPermissions(role, permissions) {
		Dispatcher.handleViewAction({ 
			type: Events.ADD_ROLE_PERMISSIONS,
			role: role,
			permissions: permissions
		});
	}

	deletePermission(role, permission) {
		Dispatcher.handleViewAction({ 
			type: Events.DELETE_ROLE_PERMISSION,
			role: role,
			permission: permission
		});
	}

	addSubRoles(role, subRoles) {
		Dispatcher.handleViewAction({ 
			type: Events.ADD_ROLE_SUBROLES,
			role: role,
			subRoles: subRoles
		});
	}

	deleteSubRole(role, subRole) {
		Dispatcher.handleViewAction({ 
			type: Events.DELETE_ROLE_SUBROLE,
			role: role,
			subRole: subRole
		});
	}
	
	delete(role) {
		Dispatcher.handleViewAction({ 
			type: Events.DELETE_ROLE,
			role: role
		});
	}
	
	deleted(role) {
		Dispatcher.handleServerAction({ 
			type: Events.ROLE_DELETED,
			role: role
		});
	}
}

export default new RoleActions();