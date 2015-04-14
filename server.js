require("babel/register");

var express = require('express'),
	http = require('http'),
	path = require('path'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	hbs = require('express-hbs'),
	logger = require("./lib/logger"),
	packageInfo = require('./package.json'),
    crypto = require('crypto');

// Initialize configuration.
var nconf = require('nconf');
nconf.argv()
	.env()
	.file({
		file: 'config.json'
	})
	.defaults({
		ENV: 'development',
		PORT: 3500,
		versionHash: (crypto.createHash('md5').update(packageInfo.version + Date.now()).digest('hex')).substring(0, 10)
	});

// Initialize web application.
var app = express();
app.use(bodyParser.json());
app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
	stream: logger.stream
}));

logger.info('versionHash:', nconf.get('versionHash'));
app.locals.versionHash = nconf.get('versionHash');
app.locals.isProduction = nconf.get('ENV') === 'production';
app.locals.isDevelopment = !app.locals.isProduction;

// View engine config.
hbs.registerHelper('json', function(context) {
	return JSON.stringify(context, null, 2);
});
hbs.registerHelper('config', function(context) {
	return nconf.get(context);
});
app.engine('hbs', hbs.express4({
	defaultLayout: path.join(__dirname, 'views/layout/default.hbs')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Configure static files.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize the routes.
require('./lib/routes/api')(app);
require('./lib/routes/views')(app);
require('./lib/routes/errors')(app);

// Start the server.
module.exports = http.createServer(app).listen(nconf.get('PORT'), function() {
	logger.info('Express server listening on port: ' + nconf.get('PORT') + " (env: " + nconf.get('ENV') + ")");
});