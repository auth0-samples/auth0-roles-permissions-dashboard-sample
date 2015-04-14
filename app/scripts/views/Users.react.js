import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';

import BaseView from '../components/BaseView.react';

import PageHeader from '../partials/PageHeader.react';
import PromptModal from '../partials/PromptModal.react';

import UserRolesModal from './UserRolesModal.react';
import UserRoleLabel from './UserRoleLabel.react';

import UserStore from '../stores/UserStore';
import UserActions from '../actions/UserActions';

import RoleStore from '../stores/RoleStore';
import RoleActions from '../actions/RoleActions';

export default class Users extends BaseView {

  constructor(props) {
    super(props);

    // Load initial state.
    this.stores = [RoleStore, UserStore];
    this.state = this.getStateFromStores();

    // Load the required data.
    UserActions.load();
    RoleActions.load();
  }

  getStateFromStores() {
    return {
      roles: RoleStore.getAll()
    };
  }

  addRoles(user, roles) {
    UserActions.addRoles(user, roles);
  }

  deleteRoles(user, roles) {
    UserActions.deleteRoles(user, roles);
  }

  onSearchChange(event) {
    this.setState({
      search: event.target.value
    });
  }

  render() {
    var filteredUsers = UserStore.getFiltered(this.state.search);

    return (
      <div className="container">
        <PageHeader title="Users">
          <input type="text" className="form-control pull-right search-header" placeholder="Search" value={this.state.search} onChange={this.onSearchChange.bind(this)} />
        </PageHeader>
        <div className="row">
          <table className="table table-striped table-responsive">
            <thead>
              <tr>
                <td>Connection</td>
                <td>Name</td>
                <td>Email</td>
                <td>Roles</td>
                <td width="20px"></td>
                <td width="20px"></td>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => {
                var user_roles = ((user.app_metadata || {}).roles || []);
                var user_roles_counter = (<div></div>);
                if (user_roles.length > 0) {
                    user_roles_counter = (<span className="badge progress-bar-info">{user_roles.length}</span>);
                }

                return (
                    <tr key={user.user_id}>
                      <td>{user.identities[0].connection}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user_roles_counter}</td>
                      <td>
                        <BS.ModalTrigger modal={<UserRolesModal user={user} roles={this.state.roles} onAddRoles={(roles) => this.addRoles(user, roles)} />}>
                          <span className="table-button glyphicon glyphicon-plus" aria-hidden="true"></span>
                        </BS.ModalTrigger>
                      </td>
                      <td>
                        <BS.ModalTrigger modal={<UserRolesModal user={user} roles={this.state.roles} onDeleteRoles={(roles) => this.deleteRoles(user, roles)} />}>
                          <span className="table-button glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </BS.ModalTrigger>
                      </td>
                    </tr>
                );
              })}
        </tbody>
        </table>
        </div>
        </div>
    );
  }
}

Users.contextTypes = {
  router: React.PropTypes.func
};
