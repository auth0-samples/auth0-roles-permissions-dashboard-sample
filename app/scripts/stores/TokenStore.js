import Events from '../Events';
import DispatchStore from './DispatchStore';
import AuthenticationActions from '../actions/AuthenticationActions';

class TokenStore extends DispatchStore {
	init() {
		if (this.isAuthenticated()) {
			var session = this.get();
			AuthenticationActions.authenticated(session.token, session.access_token);
		}
	}

	handleAction(action) {
		switch (action.type) {
			case Events.USER_AUTHENTICATED:
				this.set(action.token, action.access_token);
				break;
			case Events.USER_LOGGED_OUT:
				this.clear();
				break;
			default:
		}
	}

	getToken() {
		return store.get('token');
	}

	get() {
		return {
			token: store.get('token'),
			access_token: store.get('access_token')
		};
	}

	set(token, access_token) {
		if (token && access_token) {
			store.set('token', token);
			store.set('access_token', access_token);
			this.emitChange();
		}
	}

	clear() {
		store.remove('token');
		store.remove('access_token');
		this.emitChange();
	}

	isAuthenticated() {
		var session = this.get();
		return session && session.token && session.access_token;
	}
}

export default new TokenStore();