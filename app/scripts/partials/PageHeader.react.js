import React from 'react';
import BS from 'react-bootstrap';

export default class PageHeader extends React.Component {
  render() {
    return (
      <div className="row page-header">
        <div className="col-md-6">
          <h2>{this.props.title}</h2>
        </div>
        <div className="col-md-6">
          {this.props.children}
        </div>
      </div>
    );
  }
}