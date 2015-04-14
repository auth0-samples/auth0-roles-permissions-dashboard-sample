import React from 'react';
import Router from 'react-router';
import Notification from '../partials/Notification.react';

import ApplicationActions from '../actions/ApplicationActions';
import NotificationActions from '../actions/NotificationActions';
import NotificationStore from '../stores/NotificationStore';

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);

    // Set the default state.
    this.state = {
      notifications: this.getNotifications()
    };

    // Update the state when the store changes.
    this.onChange = () => {
      this.setState({
        notifications: this.getNotifications()
      });
    };
  }

  hideMessage(messageId) {
    NotificationActions.hide(messageId);
  }

  getNotifications() {
    return NotificationStore.get();
  }

  componentDidMount() {
    this.setState({
      notifications: this.getNotifications()
    });
    NotificationStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    NotificationStore.removeChangeListener(this.onChange);
  }

  render() {
    return (
      <div className='notifications'>
      {this.state.notifications.map((notification, i) => {
        return (
           <Notification
              key={notification.id}
              level={notification.level}
              message={notification.message}
              onHide={() => this.hideMessage(notification.id) } />
        );
      })}
      </div>
    );
  }
}