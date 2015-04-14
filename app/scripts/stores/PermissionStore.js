import Api from '../core/ApiClient';
import Notify from '../core/Notify';

import Events from '../Events';
import CollectionStore from './CollectionStore';

import PermissionActions from '../actions/PermissionActions';
import NotificationActions from '../actions/NotificationActions';

class PermissionStore extends CollectionStore {
	getId(item) {
		return item.id;
	}

	getSortValue(item) {
		return item.application;
	}

	getFilter(query) {
		return function(item) {
			return item.name.toUpperCase().indexOf(query.toUpperCase()) >= 0 
				|| item.description.toUpperCase().indexOf(query.toUpperCase()) >= 0;
		};
	}

	handleAction(action) {
		switch (action.type) {
			// Load the permissions.
			case Events.LOAD_PERMISSIONS:
				Notify('permissions.load', Api.getPermissions(action.permission))
					.then((data) => {
						PermissionActions.loaded(data.permissions);
					});
				break;

			// Permissions have been loaded, update the store.
			case Events.PERMISSIONS_LOADED:
				if (action.permissions) {
					this.setAll(action.permissions);
					this.emitChange();
				}
				break;

			// Save the permission.
			case Events.SAVE_PERMISSION:
				Notify('permission.save', Api.savePermission(action.permission))
					.then((data) => {
						PermissionActions.saved(data);
					});
				break;

			// Permission saved.
			case Events.PERMISSION_SAVED:
				if (action.permission) {
					this.set(action.permission);
					this.emitChange();
				}
				break;

			// Delete the permission.
			case Events.DELETE_PERMISSION:
				Notify('permission.delete', Api.deletePermission(action.permission))
					.then((data) => {
						PermissionActions.deleted(action.permission);
					});
				break;

			// Permission deleted.
			case Events.PERMISSION_DELETED:
				if (action.permission) {
					this.delete(action.permission);
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

export default new PermissionStore();