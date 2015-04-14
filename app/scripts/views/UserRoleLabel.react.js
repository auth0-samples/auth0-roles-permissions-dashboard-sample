import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';

import RoleStore from '../stores/RoleStore';

export default class UserRoleLabel extends React.Component {

  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render() {
  	if (!this.state.roles)
  		return (<div></div>);
    return (
  		<span className="alert alert-success">{RoleStore.getName(this.state.role_id)}</span>
    );
  }
}