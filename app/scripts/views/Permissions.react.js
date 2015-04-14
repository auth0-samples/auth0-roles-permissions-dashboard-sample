import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';

import BaseView from '../components/BaseView.react';

import PageHeader from '../partials/PageHeader.react';
import PromptModal from '../partials/PromptModal.react';

import PermissionModal from './PermissionModal.react';
import PermissionActions from '../actions/PermissionActions';
import PermissionStore from '../stores/PermissionStore';

import ApplicationActions from '../actions/ApplicationActions';
import ApplicationStore from '../stores/ApplicationStore';


export default class Permissions extends BaseView {

  constructor(props) {
    super(props);

    // Load initial state.
    this.stores = [ApplicationStore, PermissionStore];
    this.state = this.getStateFromStores();

    // Load the required data.
    ApplicationActions.load();
    PermissionActions.load();
  }

  getStateFromStores() {
    return {
      apps: _.map(ApplicationStore.getAllSorted(), function(app) {
        return {
          key: app.client_id,
          label: app.name
        };
      })
    };
  }

  savePermission(permission) {
    PermissionActions.save(permission);
  }

  deletePermission(permission) {
    PermissionActions.delete(permission);
  }

  onSearchChange(event) {
    this.setState({
      search: event.target.value
    });
  }

  render() {
    var filteredPermissions = PermissionStore.getFiltered(this.state.search);

    return (
      <div className="container">
        <PageHeader title="Permissions">
          <BS.ModalTrigger modal={<PermissionModal apps={this.state.apps} onPermissionSave={this.savePermission.bind(this)} />}>
            <BS.Button bsStyle="primary" className="pull-right">
              <i className="glyphicon glyphicon-plus"></i> New Permission
            </BS.Button>
          </BS.ModalTrigger>
          <input type="text" className="form-control pull-right search-header" placeholder="Search" value={this.state.search} onChange={this.onSearchChange.bind(this)} />
        </PageHeader>
        <div className="row">
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
              {filteredPermissions.map((permission, i) => {
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
                      <td>
                        <BS.ModalTrigger modal={<PermissionModal apps={this.state.apps} onPermissionSave={this.savePermission.bind(this)} permission={permission} />}>
                          <span className="table-button glyphicon glyphicon-cog" aria-hidden="true"></span>
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

Permissions.contextTypes = {
  router: React.PropTypes.func
};
