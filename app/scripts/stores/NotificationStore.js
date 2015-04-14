import _ from 'lodash';
import uuid from 'uuid';
import { Map } from 'immutable';

import Events from '../Events';
import DispatchStore from './DispatchStore';

class NotificationStore extends DispatchStore {
	constructor() {
		super();
		this.notifications = Map();
	}

	notify(notification, timeout) {
		var messageId = uuid.v4();

		// Add notification.
		this.notifications = this.notifications.set(messageId, {
			id: messageId,
			level: notification.level,
			message: notification.message
		});
		this.emitChange();

		// Hide after timeout.
		if (notification.timeout > 0) {
			var timeout = notification.timeout;
			setTimeout(() => { this.hide(messageId); }, timeout);
		}

		return messageId;
	}

	hide(messageId) {
		this.notifications = this.notifications.delete(messageId);
		this.emitChange();
	}

	get() {
		return this.notifications.toArray();
	}
}

export default new NotificationStore();