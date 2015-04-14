import Events from '../Events';
import Dispatcher from '../core/AppDispatcher';

class ApplicationActions {
	load() {
		Dispatcher.handleViewAction({ 
			type: Events.LOAD_APPLICATIONS
		});
	}

	loaded(applications) {
		Dispatcher.handleServerAction({ 
			type: Events.APPLICATIONS_LOADED,
			applications: applications
		});
	}
}

export default new ApplicationActions();