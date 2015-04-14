import React from 'react';
import Router from 'react-router';

import Lock from '../core/Lock';
import Config from '../core/Config';
import Logger from '../core/Logger';
import AuthenticationActions from '../actions/AuthenticationActions';

export default class LoginWidget extends React.Component {
  render() {
    return (
      <div></div>
    );
  }

  componentDidMount() {
    Lock.init(Config.get('auth0ClientId'), Config.get('auth0Domain'));
    Lock.show((err, profile, token, access_token) => {
      if (err) {
        Logger.error('Authentication error: `' + JSON.stringify(err) + '`');
      } else {
        // Send authenticated event.
        AuthenticationActions.authenticated(profile, token, access_token);

        // Navigate back to return url.
        var nextPath = this.context.router.getCurrentQuery().nextPath;
        if (nextPath) {
          this.context.router.transitionTo(nextPath);
        } else {
          this.context.router.transitionTo('/');
        }
      }
    });
  }
}

LoginWidget.contextTypes = {
  router: React.PropTypes.func
};