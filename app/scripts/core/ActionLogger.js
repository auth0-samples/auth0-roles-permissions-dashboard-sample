import Dispatcher from './AppDispatcher';

// Initialize logger.
import { LogFactory } from '../core/Logger';
let viewActionLogger = LogFactory('view-action');
let serverActionLogger = LogFactory('server-action');

// Initialize the action logger by registering a handler.
export function init() {
	Dispatcher.register((evt) => {
		if (evt.source === 'VIEW_ACTION')
			viewActionLogger.log('Received: `' + evt.type.replace(/_/g, ' ') + '`');
		if (evt.source === 'SERVER_ACTION')
			serverActionLogger.log('Received: `' + evt.type.replace(/_/g, ' ') + '`');
	});
}