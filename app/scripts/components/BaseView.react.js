import React, { Component } from 'react'

export default class BaseView extends React.Component {
  constructor(props) {
    super(props);

    this._onStoreChange = this._onStoreChange.bind(this);
  }

  componentDidMount() {
    if (this.stores) {
      this.stores.forEach((store) => {
        store.addChangeListener(this._onStoreChange);
      });
      this._onStoreChange();
    }
  }

  componentWillUnmount() {
    if (this.stores) {
      this.stores.forEach((store) => {
        store.removeChangeListener(this._onStoreChange);
      });
    }
  }

  _onStoreChange() {
    if (this.getStateFromStores) {
      this.setState(this.getStateFromStores());
    }
  }
}