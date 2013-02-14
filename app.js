var   express     = require('express')
    , http      = require('http')
    , server    = require('./server/server')
    , path      = require('path')
    , config    = require('nconf')
    , fs        = require('fs');

// Initialize configuration
config.env()
      .argv()
      .overrides(require('./config/server.json'))
      .defaults(require('./config/defaults.json'));

var app = express();

app.configure(function() {
    app.set('port', config.get("webserver:port"));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

// Initialize controllers
var controllers = fs.readdirSync("./controllers");

for (i in controllers) {
    var controllerPath = "./controllers/" + controllers[i];
    require(controllerPath)(app);
}

// Initialize socket.io server
var httpServer = http.createServer(app);

httpServer.listen(app.get('port'), function() {
    console.log("DJ Server active on port" + app.get('port'));
});

server.start();