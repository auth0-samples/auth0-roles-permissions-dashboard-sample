import Events from '../Events';
import NotificationStore from '../stores/NotificationStore';

class NotificationActions {
  error(message, timeout) {
    return NotificationStore.notify({
      level: 'error',
      message: message,
      timeout: timeout
    });
  }

  success(message, timeout) {
    return NotificationStore.notify({
      level: 'success',
      message: message,
      timeout: timeout
    });
  }

  info(message, timeout) {
    return NotificationStore.notify({
      level: 'info',
      message: message,
      timeout: timeout
    });
  }

  warn(message, timeout) {
    return NotificationStore.notify({
      level: 'warning',
      message: message,
      timeout: timeout
    });
  }

  hide(messageId) {
    return NotificationStore.hide(messageId);
  }
}

export default new NotificationActions();

