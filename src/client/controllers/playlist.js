var roomManager = require('../../shared/roommanager');

/**
 * Playlist
 *
 * @class Server.controller.Playlist
 */
module.exports = function(app) {

    app.get('/playlist/:room', function(req, res) {
        res.send(JSON.stringify({
            playlist: roomManager.getRoom(req.params.room).getPlaylist()
        }));
    });

    app.post('/playlist/:room', function(req, res) {
        roomManager.getRoom(req.params.room).setPlaylist(req.body.playlist);
        res.send(JSON.stringify({
            playlist: roomManager.getRoom(req.params.room).getPlaylist()
        }));
    });

    app.post('/playlist/:room', function(req, res) {
        console.log('posted playlist', req.body);
        roomManager.getRoom(req.params.room).setPlaylist(JSON.parse(req.body.playlist));
    });
};