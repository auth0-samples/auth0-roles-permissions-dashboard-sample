import Api from '../core/ApiClient';
import Notify from '../core/Notify';

import Events from '../Events';
import CollectionStore from './CollectionStore';

import ApplicationActions from '../actions/ApplicationActions';

class ApplicationStore extends CollectionStore {
	getId(item) {
		return item.client_id;
	}

	getSortValue(item) {
		return item.name;
	}

	getName(client_id) {
		return this.tryGet(client_id).name;
	}

	handleAction(action) {
		switch (action.type) {
			// Load the applications.
			case Events.LOAD_APPLICATIONS:
				if (this.isEmpty()) {
					Notify('applications.load', Api.getApplications())
						.then((data) => {
							ApplicationActions.loaded(data);
						});
				}
				break;

			// Applications have been loaded.
			case Events.APPLICATIONS_LOADED:
				if (action.applications) {
					this.setAll(action.applications);
					this.emitChange();
				}
				break;

			// User logged out, clear the current applications.
			case Events.USER_LOGGED_OUT:
				this.trigger(() => {
					this.clear();
				});
				break;
				
			default:
		}
	}
}

export default new ApplicationStore();