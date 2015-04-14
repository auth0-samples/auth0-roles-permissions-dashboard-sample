import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';


export default class ApplicationPermissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
  	if (!this.props.application)
  		return (<div>This application does not have any permissions defined.</div>);
    return (
	    <table className="table">
	      <thead>
	        <tr>
	          <td>Name</td>
	          <td>All Apps</td>
	          <td>Apps</td>
	          <td width="20px"></td>
	          <td width="20px"></td>
	        </tr>
	      </thead>
	    </table>
    );
  }
}