import React from 'react';
import Router from 'react-router';

import Config from '../core/Config';
import RouterService  from '../core/RouterService';

// Initialize logger.
import { LogFactory } from '../core/Logger';
let logger = LogFactory('router');

// Root handler.
var Shell = React.createClass({
  render: function() {
    return (<Router.RouteHandler {...this.props} />);
  }
});

// Load views.
import Login from '../views/Login.react';
import Authenticated from './Authenticated.react';
import Dashboard from './Dashboard.react';
import Roles from '../views/Roles.react';
import Users from '../views/Users.react';
import Permissions from '../views/Permissions.react';

// Define the routes.
var routes = (
  <Router.Route name="app" path="/" handler={Shell}>
    <Router.Route name="login" path="/login" handler={Login} />
    <Router.Route handler={Authenticated}>
      <Router.Route handler={Dashboard}>
        <Router.Route name="permissions" path="/permissions" handler={Permissions} />
        <Router.Route name="roles" path="/roles" handler={Roles} />
        <Router.Route name="users" path="/users" handler={Users} />
        <Router.Redirect from="" to="roles" />
      </Router.Route>
    </Router.Route>
  </Router.Route>
);

// Create the router.
var router = Router.create({ routes });
RouterService.set(router);

// Start the router.
export function init(config) {
  router.run(function (Handler, state) {

    // Log every router event.
    logger.info('Navigating to *' + state.path + '*');

    // Render the current route.
    React.render(<Handler {...state} />, document.body);
  });
}
