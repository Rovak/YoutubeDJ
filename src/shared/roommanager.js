var _ = require('underscore'),
    rooms = {};

/**
 * @class Server.Room
 *
 * @param {Integer} id
 * @returns {Room}
 */
function Room(id) {

    var _playlist = [];

    /**
     * Adds a new video to the playlist
     *
     * Before a new video is added it will be checked for duplicate entries
     *
     * @param {SimpleObject} video
     */
    this.addVideo = function(video) {
        var dup = _.find(_playlist, function(item){
            return item.id === video.id
        });
        if (typeof dup === 'undefined') {
            _playlist.push(video);
        }
    };

    /**
     * Returns the playlist for the current room
     *
     * @returns {Array}
     */
    this.getPlaylist = function() {
        return _playlist;
    };

    /**
     * Sets the playlist for the current room
     *
     * @param {Array} playlist
     */
    this.setPlaylist = function(playlist) {
        _playlist = playlist;
    };

    /**
     * @returns {Integer}
     */
    this.getId = function() {
        return id;
    };
}

/**
 * Retrieve a room
 *
 * @class Server.RoomManager
 *
 * @param {Integer} id
 * @returns {Room}
 */
exports.getRoom = function(id) {
    if (!rooms[id]) {
        rooms[id] = new Room(id);
    }
    return rooms[id];
};