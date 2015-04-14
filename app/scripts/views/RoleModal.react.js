import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';
import Backbone from 'backbone';

import { Select, TextInput } from '../partials/Forms.react';

export default class RoleModal extends React.Component {
  constructor(props) {
    super(props);

    var role = props.role || {};
    this.state = {
      id: role.id,
      name: role.name,
      description: role.description,
      application: role.application
    };

    if (this.state.id) {
      this.state.title = 'Edit Role: ' + (role.name || role.id);
    }
    else {
      this.state.title = 'New Role';
    }
  }

  saveChanges() {
    var role = {
      id: this.state.id,
      name: this.state.name,
      description: this.state.description
    };
    this.props.onRoleSave(role);
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