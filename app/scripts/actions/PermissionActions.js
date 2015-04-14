import Events from '../Events';
import Dispatcher from '../core/AppDispatcher';

class PermissionActions {
	load() {
		Dispatcher.handleViewAction({ 
			type: Events.LOAD_PERMISSIONS
		});
	}

	loaded(permissions) {
		Dispatcher.handleServerAction({ 
			type: Events.PERMISSIONS_LOADED,
			permissions: permissions
		});
	}

	save(permission) {
		Dispatcher.handleViewAction({ 
			type: Events.SAVE_PERMISSION,
			permission: permission
		});
	}
	
	saved(permission) {
		Dispatcher.handleServerAction({ 
			type: Events.PERMISSION_SAVED,
			permission: permission
		});
	}
	
	delete(permission) {
		Dispatcher.handleViewAction({ 
			type: Events.DELETE_PERMISSION,
			permission: permission
		});
	}
	
	deleted(permission) {
		Dispatcher.handleServerAction({ 
			type: Events.PERMISSION_DELETED,
			permission: permission
		});
	}
}

export default new PermissionActions();