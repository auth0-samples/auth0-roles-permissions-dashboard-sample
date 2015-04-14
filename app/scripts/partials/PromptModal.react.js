import React from 'react';
import BS from 'react-bootstrap';

export default class PromptModal extends React.Component {
  render() {
    return(
      <BS.Modal {...this.props} animation={false} title={this.props.title}>
        <div className="modal-body">
          <p>{this.props.message}</p>
        </div>
        <div className="modal-footer">
          <BS.Button className="btn btn-primary" onClick={() => this.props.onRequestHide()}>No</BS.Button>
          <BS.Button onClick={() => this.handleAcceptDialog()}>Yes</BS.Button>
        </div>
      </BS.Modal>
    )
  }

  handleAcceptDialog() {
    this.props.onAcceptDialog();
    this.props.onRequestHide();
  }
}