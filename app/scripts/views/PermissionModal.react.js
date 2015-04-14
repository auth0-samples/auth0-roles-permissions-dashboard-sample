import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';
import Backbone from 'backbone';

import { Select, TextInput } from '../partials/Forms.react';

export default class PermissionModal extends React.Component {
	constructor(props) {
		super(props);

		var permission = props.permission || {};
		this.state = {
			id: permission.id,
			name: permission.name,
			description: permission.description,
			application: permission.application
		};

		if (this.state.id) {
			this.state.title = 'Edit permission: ' + (permission.name || permission.id);
		}
		else {
			this.state.title = 'New Permission';
		}
	}

	saveChanges() {
		var permission = {
			id: this.state.id,
			name: this.state.name,
			description: this.state.description,
			application: this.state.application
		};
		this.props.onPermissionSave(permission);
		this.props.onRequestHide();
	}

	onApplicationChanged(event) {
		this.setState({
			application: event.target.value
		});
	}

	onNameChanged(event) {
		this.setState({
			name: event.target.value
		});
	}

	onDescriptionChanged(event) {
		this.setState({
			description: event.target.value
		});
	}

  render() {
    return (
      <BS.Modal {...this.props} animation={false} title={this.state.title}>
        <div className="modal-body">
          <form className="form-horizontal">
            <Select name="app" label="Application" placeholder="Name" value={this.state.application} onChange={this.onApplicationChanged.bind(this)} items={this.props.apps}/>
            <TextInput name="name" label="Name" placeholder="Name" value={this.state.name} onChange={this.onNameChanged.bind(this)} />
            <TextInput name="description" label="Description" placeholder="Description" value={this.state.description} onChange={this.onDescriptionChanged.bind(this)} />
          </form>
        </div>
        <div className="modal-footer">
          <BS.Button onClick={this.props.onRequestHide}>Close</BS.Button>
          <BS.Button className="btn btn-primary" onClick={this.saveChanges.bind(this)}>Save changes</BS.Button>
        </div>
      </BS.Modal>
    );
  }
}