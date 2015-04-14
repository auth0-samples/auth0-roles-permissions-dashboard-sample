import React from 'react';
import Router from 'react-router';
import BS from 'react-bootstrap';

import NavbarMenuItem from './NavbarMenuItem.react';

import AuthenticationActions from '../actions/AuthenticationActions';
import ProfileStore from '../stores/ProfileStore';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getProfile();
  }

  getProfile() {
    return {
      profile: ProfileStore.get(),
    };
  }

  componentDidMount() {
    ProfileStore.addChangeListener(this._onProfileChange);
  }

  componentWillUnmount() {
    ProfileStore.removeChangeListener(this._onProfileChange);
  }

  _onProfileChange() {
    this.setState(this.getProfile());
  }

  handleLogout() {
    AuthenticationActions.logout();
  }

  render() {
    // Default values.
    let displayName = "User";
    let profileImageUrl = 'https://graph.facebook.com/3/picture';

    // Should always be true.
    if (this.state.profile) {
      displayName = this.state.profile.name;
      profileImageUrl = this.state.profile.picture;
    }

    // Customize the brand.
    let brand = <Router.Link to='app'>Auth0 Claims Manager</Router.Link>;

    // Customize the profime menu.
    let profileMenuContent = (
      <span><img src={profileImageUrl} className="profile-image img-circle" /> {displayName}</span>
    );

    return (
      <BS.Navbar fixedTop brand={brand} toggleNavKey={1}>
        <BS.Nav right eventKey={0}>
          <NavbarMenuItem title="Permissions" route="/permissions" />
          <NavbarMenuItem title="Roles" route="/roles" />
          <NavbarMenuItem title="Users" route="/users" />
          <BS.DropdownButton title={profileMenuContent}>
            <NavbarMenuItem title="Profile" route="/profile" />
            <BS.MenuItem eventKey={3} onSelect={this.handleLogout}>Logout</BS.MenuItem>
          </BS.DropdownButton>
        </BS.Nav>
      </BS.Navbar>
    );
  }
}

Navbar.contextTypes = {
  router: React.PropTypes.func
};