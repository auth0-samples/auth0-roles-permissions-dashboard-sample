var jwt = require('express-jwt');
var nconf = require('nconf');

module.exports.authenticate = jwt({
  secret: new Buffer(nconf.get('AUTH0_CLIENT_SECRET'), 'base64'),
  audience: nconf.get('AUTH0_CLIENT_ID')
});