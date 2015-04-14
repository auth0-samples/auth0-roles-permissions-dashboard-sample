var nconf = require('nconf');

module.exports = function(app) {

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (nconf.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      var data = {
        status: err.status,
        message: err.message,
        error: err
      };
      handleError(data, req, res);
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var data = {
      status: err.status,
      message: err.message,
      error: {}
    };
    handleError(data, req, res);
  });

  var handleError = function(err, req, res) {
    if (req.path.indexOf('/api') == 0 || req.path.indexOf('/data') == 0) {
      res.json(err);
    } else {
      res.render('error', err);
    }
  }

};
