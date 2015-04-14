import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';

import PromptModal from '../partials/PromptModal.react';

import RoleActions from '../actions/RoleActions';

export default class RoleSubRolesTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  deleteSubRole(role) {
    RoleActions.deleteSubRole(this.state.role, role);
  }

  render() {
  	if (!this.state.role.sub_roles || this.state.role.sub_roles.length == 0)
  		return (<div></div>);
    return (
    	<div>
    	  <h5>Sub Roles</h5>
          <table className="table table-striped table-responsive">
            <thead>
              <tr>
                <td>Name</td>
                <td>Description</td>
                <td width="20px"></td>
              </tr>
            </thead>
            <tbody>
              {this.state.role.sub_roles.map((role_id, i) => {

              	var role = _.find(this.state.roles, { 'id': role_id });
              	if (!role) 
              		return (<div></div>);

                return (
                    <tr key={role.id}>
                      <td>{role.name}</td>
                      <td>{role.description}</td>
                      <td>
                        <BS.ModalTrigger modal={<PromptModal title="Confirm Delete" message="Are you sure you want to delete this sub role?" onAcceptDialog={() => this.deleteSubRole(role)} />}>
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