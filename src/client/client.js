var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var http = require('http')
var path = require('path')
var config = require('nconf')
var fs = require('fs');

exports.createServer = function() {

    var app = express();

    var port = config.get("webserver:port");
    app.set('port', port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // Initialize controllers
    var controllersFolder = __dirname + "/controllers/";
    var controllers = fs.readdirSync(controllersFolder);

    for (var i in controllers) {
        var controllerPath = controllersFolder + controllers[i];
        require(controllerPath)(app);
    }

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });

    var server = http.createServer(app);
    server.listen(port);
};