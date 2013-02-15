var   http      = require('http')
    , socket_io = require('socket.io')
    , config    = require('nconf');

/**
 * @class Server.Server
 */
var Server = {};

/**
 * @property
 * @private
 */
var HttpServer;

/**
 * @property
 * @private
 */
var Channel;

/**
 * @property
 * @private
 */
var SocketIO;

/**
 * @method
 */
Server.onConnection = function(socket) {

    var room;

    socket.on('join', function(data) {
        socket.join(data.room);
        console.log("socket joined! " + data.room)
        room = Channel.in(data.room);
    });
    socket.on('video', function(data) {
        room.emit('video', data);
    });
    socket.on('screen_state', function(data) {
        console.log("got screen state")
        room.emit('screen_state', data);
    });
};

Server.createServer = function() {

    HttpServer = http.createServer();
    HttpServer.listen(config.get("socketio:port"));

    SocketIO = socket_io.listen(HttpServer);
    Channel = SocketIO.of('/channel');
    Channel.on('connection', Server.onConnection);
};

exports = module.exports = Server;