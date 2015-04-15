import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';

import BaseView from '../components/BaseView.react';
import UserActions from '../actions/UserActions';
import ApplicationActions from '../actions/ApplicationActions';

import ApplicationStore from '../stores/ApplicationStore';
import UserEffectivePermissionsStore from '../stores/UserEffectivePermissionsStore';

export default class UserEffectivePermissionsModal extends BaseView {
	constructor(props) {
		super(props);

    	// Load initial state.
    	this.stores = [ApplicationStore, UserEffectivePermissionsStore];
		this.state = {
			loading: true,
			title: 'Effective Roles and Permissions for ' + (this.props.user.name)
		};

		// Load the user's permissions.
		ApplicationActions.load();
		UserActions.loadEffectivePermissions(this.props.user.user_id);
	}

	getStateFromStores() {
		return {
			loading: UserEffectivePermissionsStore.loading,
			roles: UserEffectivePermissionsStore.effective_roles,
			permissions: UserEffectivePermissionsStore.effective_permissions
		};
	}

	  render() {
	  	if (this.state.loading) {	
		    return (
		      <BS.Modal {...this.props} bsStyle='primary' backdrop={true} animation={true} title={this.state.title}>
		        <div className="modal-body">
					Loading...
		        </div>
		        <div className="modal-footer">
		          <BS.Button onClick={this.props.onRequestHide}>Close</BS.Button>
		        </div>
		      </BS.Modal>
		    );
	  	}

	    return (
		    <BS.Modal {...this.props} bsStyle='primary' backdrop={true} animation={true} title={this.state.title}>
	        <div className="modal-body">
	        	<h5>Roles</h5>
				<table className="table table-striped table-responsive">
		            <thead>
		              <tr>
		                <td>Name</td>
		                <td>Description</td>
		              </tr>
		            </thead>
		            <tbody>
		              {this.state.roles.map((r, i) => {
		                return (
		                    <tr key={r.id}>
		                      <td>{r.name}</td>
		                      <td>{r.description}</td>
		                    </tr>
		                );
		              })}
		        	</tbody>
		        </table>

		        <h5>Permissions</h5>
			    <table className="table table-striped table-responsive">
			            <thead>
			              <tr>
			                <td>Application</td>
			                <td>Permission</td>
			                <td>Description</td>
			              </tr>
			            </thead>
			            <tbody>
			              {this.state.permissions.map((permission, i) => {

			                return (
			                    <tr key={permission.id}>
			                      <td>{ApplicationStore.getName(permission.application)}</td>
			                      <td>{permission.name}</td>
			                      <td>{permission.description}</td>
			                    </tr>
			                );
			              })}
			        </tbody>
			        </table>
	        </div>
	        <div className="modal-footer">
	          <BS.Button onClick={this.props.onRequestHide}>Close</BS.Button>
	        </div>
	      </BS.Modal>
	    );
	  }
}