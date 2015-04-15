import Api from '../core/ApiClient';
import Notify from '../core/Notify';

import Events from '../Events';
import DispatchStore from './DispatchStore';

import UserActions from '../actions/UserActions';
import NotificationActions from '../actions/NotificationActions';

class UserEffectivePermissionsStore extends DispatchStore {
	constructor() {
		super();
		this.loading = false;
		this.user_id = null;
		this.effective_permissions = [];
		this.effective_roles = [];
	}

	handleAction(action) {
		switch (action.type) {
			// Load the permissions.
			case Events.LOAD_USER_EFFECTIVE_PERMISSIONS:
				this.loading = true;
				this.user_id = action.user_id;
				this.effective_permissions = [];
				this.effective_roles = [];
				this.emitChange();

				Notify('user_effective_permissions.load', Api.getUserEffectivePermissions(action.user_id))
					.then((data) => {
						this.loading = false;
						UserActions.effectivePermissionsLoaded(action.user_id, data.roles, data.permissions);
					})
					.catch((err) => {
						this.loading = false;
						this.emitChange();
					});
				break;

			// Permissions have been loaded.
			case Events.USER_EFFECTIVE_PERMISSIONS_LOADED:
				this.user_id = action.user_id;
				this.effective_permissions = action.permissions;
				this.effective_roles = action.roles;
				this.emitChange();
				break;

			default:
		}
	}
}

export default new UserEffectivePermissionsStore();