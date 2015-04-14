import Events from '../Events';
import Dispatcher from '../core/AppDispatcher';

class AuthenticationActions {
	// User authenticated.
	authenticated(profile, token, access_token) {
		Dispatcher.handleServerAction({
			type: Events.USER_AUTHENTICATED,
			profile: profile,
			token: token,
			access_token: access_token
		});
	}

	// User logged out.
	logout() {
		Dispatcher.handleServerAction({ type: Events.USER_LOGGED_OUT });
	}
}

export default new AuthenticationActions();