import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';

import { CheckboxSimple } from '../partials/Forms.react';
import ApplicationStore from '../stores/ApplicationStore';

export default class RolePermissionsModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: 'Add Permissions: ' + (this.props.role.name),
			permissions: this.props.permissions,
			selected_permissions: []
		};
	}

	saveChanges() {
		this.props.onPermissionsSave(this.state.selected_permissions);
		this.props.onRequestHide();
	}

	onSelectedChanged(event) {
		var selected_permissions = this.state.selected_permissions;
		var id = event.target.name;
		var i = selected_permissions.indexOf(id);
		if (i > -1) {
			selected_permissions.splice(i, 1);
		} else {
			selected_permissions.push(id);
		}
		this.setState({
			selected_permissions: selected_permissions
		});
	}

	  render() {
	    return (
	      <BS.Modal {...this.props} animation={false} title={this.state.title}>
	        <div className="modal-body">
				<table className="table table-striped table-responsive">
		            <thead>
		              <tr>
		              	<td></td>
		                <td>Application</td>
		                <td>Permission</td>
		                <td>Description</td>
		              </tr>
		            </thead>
		            <tbody>
		              {this.state.permissions.map((p, i) => {
		                return (
		                    <tr key={p.id}>
		                      <td>
		                      	<input type="checkbox" name={p.id} onChange={this.onSelectedChanged.bind(this)} />
		                      </td>
		                      <td>{ApplicationStore.getName(p.application)}</td>
		                      <td>{p.name}</td>
		                      <td>{p.description}</td>
		                    </tr>
		                );
		              })}
		        </tbody>
		        </table>
	        </div>
	        <div className="modal-footer">
	          <BS.Button onClick={this.props.onRequestHide}>Close</BS.Button>
	          <BS.Button className="btn btn-primary" onClick={this.saveChanges.bind(this)}>Save Changes</BS.Button>
	        </div>
	      </BS.Modal>
	    );
	  }
}