var nconf = require('nconf'),
    logger = require("../logger");

module.exports = function(app) {
  app.get('/', function(req, res, next) {
      res.render('index', {
          config: JSON.stringify({
            auth0Domain: nconf.get('AUTH0_DOMAIN'),
            auth0ClientId: nconf.get('AUTH0_CLIENT_ID')
          })
        });
    });
};
