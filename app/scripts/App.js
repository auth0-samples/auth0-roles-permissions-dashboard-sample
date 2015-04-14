var React = require('react');
var TokenStore = require('./stores/TokenStore');
var ActionLogger = require('./core/ActionLogger');
var ApplicationActions = require('./actions/ApplicationActions');

var App = {
  init: function(config) {

    var Config = require('./core/Config');
    Config.init(JSON.parse(config));

    // Load applications on startup.
    ApplicationActions.load();

    // Log every dispatcher action.
    ActionLogger.init();

    // Load the user's session from local storage if possible.
    TokenStore.init();

    // Start the router.
    var Routes = require('./components/Routes.react');
    Routes.init();
  }
}
module.exports = window.App = App;