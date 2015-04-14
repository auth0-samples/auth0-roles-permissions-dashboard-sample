import Events from '../Events';
import DispatchStore from './DispatchStore';

class ProfileStore extends DispatchStore {
	handleAction(action) {
		switch (action.type) {
			case Events.USER_AUTHENTICATED:
				this.set(action.profile);
				break;
			case Events.USER_LOGGED_OUT:
				this.clear();
				break;
			default:
		}
	}

	get() {
		return store.get('profile');
	}

	set(profile) {
		store.set('profile', profile);
	}

	clear() {
		store.remove('profile');
	}
}

export default new ProfileStore();