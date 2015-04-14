import React from 'react';

export default class Notification extends React.Component {
	constructor(props) {
		super(props);
	}

	getClassName() {
		if ('success' === this.props.level) {
			return 'alert alert-dismissible alert-success';
		} else if ('error' === this.props.level) {
			return 'alert alert-dismissible alert-danger';
		} else if ('info' === this.props.level) {
			return 'alert alert-dismissible alert-info';
		} else if ('warning' === this.props.level) {
			return 'alert alert-dismissible alert-warning';
		}
		return '';
	}

	render() {
		return (
			<div className={this.getClassName()}>
				<button type="button" className="close" onClick={this.props.onHide}>×</button>
				{this.props.message}
			</div>
		);
	}
}