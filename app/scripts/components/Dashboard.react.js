import React from 'react';
import Router from 'react-router';

import Navbar from '../partials/Navbar.react';
import Notifications from './Notifications.react';

export default class Dashboard extends React.Component {
  render() {
    return (
    	<div>
	        <Navbar />
	        <Notifications />
	        <Router.RouteHandler {...this.props}/>
        </div>
    )
  }
}