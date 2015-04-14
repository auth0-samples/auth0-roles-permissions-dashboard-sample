import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';

import BaseView from '../components/BaseView.react';

import PageHeader from '../partials/PageHeader.react';
import PromptModal from '../partials/PromptModal.react';

import RoleModal from './RoleModal.react';
import RolePermissionsModal from './RolePermissionsModal.react';
import RolePermissionsTable from './RolePermissionsTable.react';
import RoleSubRolesModal from './RoleSubRolesModal.react';
import RoleSubRolesTable from './RoleSubRolesTable.react';

import RoleStore from '../stores/RoleStore';
import RoleActions from '../actions/RoleActions';
import PermissionStore from '../stores/PermissionStore';
import PermissionActions from '../actions/PermissionActions';
import ApplicationStore from '../stores/ApplicationStore';
import ApplicationActions from '../actions/ApplicationActions';

export default class Roles extends BaseView {

  constructor(props) {
    super(props);

    // Load initial state.
    this.stores = [ApplicationStore, RoleStore, PermissionStore];
    this.state = this.getStateFromStores();
    this.state.selected_roles = [];

    // Load the required data.
    ApplicationActions.load();
    RoleActions.load();
    PermissionActions.load();
  }

  getStateFromStores() {
    return {
      apps: _.map(ApplicationStore.getAllSorted(), function(app) {
        return {
          key: app.client_id,
          label: app.name
        };
      }),
      roles: RoleStore.getAll(),
      permissions: PermissionStore.getAll()
    };
  }

  saveRole(permission) {
    RoleActions.save(permission);
  }

  addRolePermissions(role, permissions) {
    RoleActions.addPermissions(role, permissions);
  }

  deleteRole(permission) {
    RoleActions.delete(permission);
  }

  addSubRoles(role, subRoles) {
    RoleActions.addSubRoles(role, subRoles);
  }

  toggleRole(role) {
    var selected_roles = this.state.selected_roles;
    var role_index = selected_roles.indexOf(role.id);
    if (role_index >= 0)
      selected_roles.splice(role_index, 1);
    else
      selected_roles.push(role.id);

    this.selected_roles = selected_roles;
    this.setState({ 
      selected_roles: selected_roles
    });
  }

  onSearchChange(event) {
    this.setState({
      search: event.target.value
    });
  }

  render() {
    var filteredRoles = RoleStore.getFiltered(this.state.search);

    return (
      <div className="container">
        <PageHeader title="Roles">
          <BS.ModalTrigger modal={<RoleModal apps={this.state.apps} onRoleSave={this.saveRole.bind(this)} />}>
            <BS.Button bsStyle="primary" className="pull-right">
              <i className="glyphicon glyphicon-plus"></i> New Role
            </BS.Button>
          </BS.ModalTrigger>
          <input type="text" className="form-control pull-right search-header" placeholder="Search" value={this.state.search} onChange={this.onSearchChange.bind(this)} />
        </PageHeader>

        <div className="row">
        {filteredRoles.map((role, i) => {

          var role_body = (<div></div>);
          if (this.state.selected_roles.indexOf(role.id) >= 0) {
              role_body = (
                  <div className="panel-body">
                    <RolePermissionsTable permissions={this.state.permissions} role={role} />
                    <RoleSubRolesTable roles={this.state.roles} role={role} />
                    <BS.ButtonGroup className="pull-right">
                      <BS.ModalTrigger modal={<RoleSubRolesModal role={role} roles={this.state.roles} onSubRolesSave={(subRoles) => this.addSubRoles(role, subRoles)} />}>
                        <BS.Button bsStyle="default" bsSize='small'>
                          <i className="glyphicon glyphicon-plus"></i> Role
                        </BS.Button>
                      </BS.ModalTrigger>
                      <BS.ModalTrigger modal={<RolePermissionsModal role={role} permissions={this.state.permissions} onPermissionsSave={(p) => this.addRolePermissions(role, p)} />}>
                        <BS.Button bsStyle="default" bsSize='small' >
                          <i className="glyphicon glyphicon-plus"></i> Permission
                        </BS.Button>
                      </BS.ModalTrigger>
                    </BS.ButtonGroup>
                  </div>);
          }

          return (
            <div className="panel panel-default" key={role.id}>
              <div className="panel-heading">
                <h3 className="panel-title">
                  {role.name} - {role.description}
                  <BS.ModalTrigger modal={<RoleModal apps={this.state.apps} onRoleSave={this.saveRole.bind(this)} role={role} />}>
                    <span className="table-button glyphicon glyphicon-cog pull-right" aria-hidden="true"></span>
                  </BS.ModalTrigger>
                  <BS.ModalTrigger modal={<PromptModal title="Confirm Delete" message="Are you sure you want to delete this role?" onAcceptDialog={() => this.deleteRole(role)} />}>
                    <span className="table-button glyphicon glyphicon-trash pull-right" aria-hidden="true" style={{marginRight: 5 + 'px'}}></span>
                  </BS.ModalTrigger>
                  <span className="table-button glyphicon glyphicon-zoom-in pull-right" onClick={() => this.toggleRole(role)} style={{marginRight: 5 + 'px'}}></span>
                </h3>
              </div>
              {role_body}
            </div>
          );
        })}
        </div>
        </div>
    );
  }
}

Roles.contextTypes = {
  router: React.PropTypes.func
};
