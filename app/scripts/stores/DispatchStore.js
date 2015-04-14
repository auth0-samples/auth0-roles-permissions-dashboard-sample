import BaseStore from './BaseStore';
import Dispatcher from '../core/AppDispatcher';

export default class DispatchStore extends BaseStore {
	constructor() {
		super();

		// Centralized way for store to handle actions.
		this.dispatchToken = Dispatcher.register((payload) => 
		{
			var tokens = this.waitFor();
			if (tokens)
				Dispatcher.waitFor(tokens);
			this.handleAction(payload);
		});
	}

	/*
	 * Override this in the implementation of your store to handle actions sent by the dispatcher.
	 */
	handleAction(payload) {

	}

	/*
	 * Override this to wait for dispatcher in the implementation of your store.
	 */
	waitFor(payload) {
		return null;
	}
}