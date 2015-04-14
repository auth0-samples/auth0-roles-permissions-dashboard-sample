import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';

import { CheckboxSimple } from '../partials/Forms.react';

export default class RoleSubRolesModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: 'Add Roles: ' + (this.props.role.name),
			roles: this.props.roles,
			selected_roles: []
		};
	}

	saveChanges() {
		this.props.onSubRolesSave(this.state.selected_roles);
		this.props.onRequestHide();
	}

	onSelectedChanged(event) {
		var selected_roles = this.state.selected_roles;
		var id = event.target.name;
		var i = selected_roles.indexOf(id);
		if (i > -1) {
			selected_roles.splice(i, 1);
		} else {
			selected_roles.push(id);
		}
		this.setState({
			selected_roles: selected_roles
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
		                <td>Name</td>
		                <td>Description</td>
		              </tr>
		            </thead>
		            <tbody>
		              {this.state.roles.map((r, i) => {
		                return (
		                    <tr key={r.id}>
		                      <td>
		                      	<input type="checkbox" name={r.id} onChange={this.onSelectedChanged.bind(this)} />
		                      </td>
		                      <td>{r.name}</td>
		                      <td>{r.description}</td>
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