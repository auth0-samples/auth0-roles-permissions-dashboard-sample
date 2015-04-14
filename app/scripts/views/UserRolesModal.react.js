import _ from 'lodash';
import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';

import { CheckboxSimple } from '../partials/Forms.react';
import ApplicationStore from '../stores/ApplicationStore';

export default class UserRolesModal extends React.Component {
	constructor(props) {
		super(props);

		var title_prefix = 'Add Roles: ';
		if (!this.isCreateMode())
			title_prefix = 'Delete Roles: ';

		this.state = {
			title: title_prefix + (this.props.user.name),
			roles: this.props.roles,
			selected_roles: []
		};

		if (this.props.user_roles) {
			this.state.roles = _.filter(this.props.roles, function(r) {
				return this.props.user_roles.indexOf(r.id) > -1;;
			});
		}
	}

	isCreateMode() {
		return this.props.onAddRoles != null;
	}

	saveChanges() {
		if (this.isCreateMode())
			this.props.onAddRoles(this.state.selected_roles);
		else
			this.props.onDeleteRoles(this.state.selected_roles);
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