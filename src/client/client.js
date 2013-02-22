var express = require('express')
        , http = require('http')
        , path = require('path')
        , config = require('nconf')
        , fs = require('fs');

exports.createServer = function() {
    var app = express();

    app.configure(function() {
        app.set('port', config.get("webserver:port"));
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(__dirname + '/public'));
    });

    console.log(__dirname + '/../../node_modules/requirejs/require.js')

    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    // Initialize controllers
    var controllersFolder = __dirname + "/controllers/";
    var controllers = fs.readdirSync(controllersFolder);

    for (i in controllers) {
        var controllerPath = controllersFolder + controllers[i];
        require(controllerPath)(app);
    }

    // Initialize socket.io server
    var httpServer = http.createServer(app);

    httpServer.listen(app.get('port'), function() {
        console.log("DJ Server active on port" + app.get('port'));
    });
};
