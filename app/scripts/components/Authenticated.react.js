import React from 'react';
import Router from 'react-router';
import TokenStore from '../stores/TokenStore';
import RouterService from '../core/RouterService';

export default class Authenticated extends React.Component {
  
  static willTransitionTo(transition) {
    if (!TokenStore.isAuthenticated()) {
      transition.redirect('/login', { }, { 'nextPath': transition.path });
    }
  }

  constructor(props) {
    super(props);

    this.state = this.getSession();
    this.onTokenChange = (e) => {
      this.setState(this.getSession());

      // User logged out, go back to the login page.
      if (!TokenStore.isAuthenticated()) {
        RouterService.transitionTo('/login');
      }
    };
  }

  getSession() {
    var tokens = TokenStore.get();
    var token, access_token;
    if (tokens) {
      token = tokens.token;
      access_token = tokens.access_token
    }

    return {
      isAuthenticated: TokenStore.isAuthenticated(),
      token: token,
      access_token: access_token
    };
  }

  componentDidMount() {
    TokenStore.addChangeListener(this.onTokenChange);
  }

  componentWillUnmount() {
    TokenStore.removeChangeListener(this.onTokenChange);
  }

  render() {
    return (
      <Router.RouteHandler {...this.props} token={this.state.token}/>
    )
  }
}