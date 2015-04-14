import { EventEmitter } from 'events';

const CHANGE_EVENT = 'CHANGE_EVENT';

export default class BaseStore extends EventEmitter {

	constructor() {
		super();
		this.isLoading = false;
	}

	working(callback) {
		this.setLoading(true);
		callback();
		this.emitChange();
	}

	complete(callback) {
		callback();
		this.setLoading(false);
		this.emitChange();
	}

	trigger(callback) {
		callback();
		this.emitChange();
	}

	setLoading(isLoading) {
		this.isLoading = isLoading;
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
}