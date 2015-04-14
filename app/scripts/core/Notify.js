import Translate from '../core/Translate';
import NotificationActions from '../actions/NotificationActions';

export default function(label, promise) {
	var busyMessage = NotificationActions.info(Translate(label));

	return promise
		.then((data) => {
			NotificationActions.hide(busyMessage);
			NotificationActions.success(Translate(label + '.success'), 4000);

			return Promise.resolve(data);
		})
		.catch((data) => {
			NotificationActions.hide(busyMessage);
			NotificationActions.error(Translate(label + '.error'), 4000);

			return Promise.reject(data);
		});
}