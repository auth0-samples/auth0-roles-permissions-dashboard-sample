import React from 'react';
import Router from 'react-router';

export default class NavbarMenuItem extends React.Component { 
  render() {
      var className;
      var currentPath = Router.HashLocation.getCurrentPath();
      if (currentPath === this.props.route || currentPath.indexOf(this.props.route + '/') === 0) {
        className = "active";
      }
      return (
        <li className={className}>
          <Router.Link to={this.props.route}>{this.props.title}</Router.Link>
        </li>
      );
    }
}
