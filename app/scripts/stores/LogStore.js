import Events from '../Events';
import DispatchStore from './DispatchStore';
import { LogFactory } from '../core/Logger';

let viewActionLogger = LogFactory('view-action');
let serverActionLogger = LogFactory('server-action');

class LogStore extends DispatchStore {
	handleAction(action) {
		if (action.source === 'VIEW_ACTION')
			viewActionLogger.log('Received: `' + action.type.replace(/_/g, ' ') + '`');
		if (action.source === 'SERVER_ACTION')
			serverActionLogger.log('Received: `' + action.type.replace(/_/g, ' ') + '`');

		// Optional: call your backend to persist your actions.
	}
}

export default new LogStore();