var   http          = require('http')
    , socket_io     = require('socket.io')
    , fs            = require('fs')
    , config        = require('nconf')
    , roomManager   = require('./roommanager');

exports.start = function() {

    var app = http.createServer();
    app.listen(config.get("socketio:port"));

    var io = socket_io.listen(app);
    io.of('/channel').on('connection', function(socket) {

        var room = "";

        socket.on('join', function(data) {
            socket.join(data.room);
            room = data.room;
        });

        socket.on('video', function(data) {
            io.of('/channel').in(room).emit('video', data);
        });

        socket.on('disconnect', function(socket) {
            // Disconnect
        });

        socket.on('screen_state', function(data){
            io.of('/channel').in(room).emit('screen_state', data);
        });
    });
};