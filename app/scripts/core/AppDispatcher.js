import { Dispatcher } from 'flux';
import Dispatch from '../core/AppDispatcher';

class AppDispatcher extends Dispatcher {
	handleServerAction(action) {
		var payload = action || { };
		payload.source = 'SERVER_ACTION';
		this.dispatch(payload);
	}

	handleViewAction(action) {
		var payload = action || { };
		payload.source = 'VIEW_ACTION';
		this.dispatch(payload);
	}
}

export default new AppDispatcher();