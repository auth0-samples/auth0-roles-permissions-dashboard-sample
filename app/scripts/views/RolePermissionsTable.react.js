import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';

import PromptModal from '../partials/PromptModal.react';

import RoleActions from '../actions/RoleActions';
import ApplicationStore from '../stores/ApplicationStore';

export default class RolePermissionsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  deletePermission(permission) {
    RoleActions.deletePermission(this.state.role, permission);
  }

  render() {
  	if (!this.state.role.permissions || this.state.role.permissions.length == 0)
  		return (<div></div>);
  	if (!this.state.permissions || (this.state.role.permissions && this.state.role.permissions.length > 0 && this.state.permissions.length === 0))
  		return (<div>Loading permissions...</div>);
    return (
    	<div>
    	  <h5>Permissions</h5>
          <table className="table table-striped table-responsive">
            <thead>
              <tr>
                <td>Application</td>
                <td>Permission</td>
                <td>Description</td>
                <td width="20px"></td>
              </tr>
            </thead>
            <tbody>
              {this.state.role.permissions.map((permission_id, i) => {

              	var permission = _.find(this.state.permissions, { 'id': permission_id });
                if (!permission) {
                  return (<div></div>);
                }

                return (
                    <tr key={permission.id}>
                      <td>{ApplicationStore.getName(permission.application)}</td>
                      <td>{permission.name}</td>
                      <td>{permission.description}</td>
                      <td>
                        <BS.ModalTrigger modal={<PromptModal title="Confirm Delete" message="Are you sure you want to delete this permission?" onAcceptDialog={() => this.deletePermission(permission)} />}>
                          <span className="table-button glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </BS.ModalTrigger>
                      </td>
                    </tr>
                );
              })}
        </tbody>
        </table>
        </div>
    );
  }
}