(function(document, window, $) {
    "use strict";

    var socket,
        CurrentPlayer,
        playlistView;

    /**
     * @class Client.service.Screen
     */
    var Screen = {};

    /**
     * @method
     */
    Screen.setState = function(state) {
        for (var key in state) {
            var value = state[key];
            switch (key) {
                case 'qrcode':
                    $('body').toggleClass('hide-qr', !value);
                    break;
                case 'fullscreen':
                    $('body').toggleClass('fullscreen', value);
                    break;
                case 'volume':
                    CurrentPlayer.setVolume(value);
                    break;
                case 'next':
                    PlayNext();
                    break;
                case 'pause':
                    CurrentPlayer.Pause();
                    break;

            }
        }
    };

    /**
     * @class Client.model.Video
     */
    var Video = Backbone.Model.extend({
        defaults: {
            type: 'youtube'
        },
    });

    /**
     * @class Client.model.Playlist
     */
    var Playlist = Backbone.Collection.extend({
        /**
         * @property {Video} model
         */
        model: Video,

        /**
         * Pop the next video from the playlist
         *
         * @method
         * @returns {Video}
         */
        getNextVideo: function() {
            return this.shift();
        },

        /**
         * Synchronize the playlist with the backend server
         *
         * @method
         */
        sync: function(method, model, options) {
            options = options || {};

            var me = this,
                    list = [];

            for (var i in this.models) {
                list.push(this.models[i].toJSON());
            }

            $.post('/playlist/' + room_id, { playlist: data }, function(data) {
                me.reset(data.list);
            }, 'json');
        }
    });

    /**
     * @class Client.model.PlayListView
     */
    var PlayListView = Backbone.View.extend({
        /**
         * Handlebars template
         *
         * @property {Function} template
         */
        template: Handlebars.compile($("#playlist_template").html()),

        /**
         * @constructor
         */
        initialize: function() {
            this.setPlaylist(new Playlist());
        },

        /**
         * @method
         * @param {Playlist} playlist
         */
        setPlaylist: function(playlist)
        {
            this.playlist = playlist;
            this.playlist.on('change', this.render, this);
            this.playlist.on('add', this.render, this);
            this.playlist.on('remove', this.render, this);
            this.playlist.on('reset', this.render, this);
            this.render();
        },
        /**
         * @method
         * @return {Playlist}
         */
        getPlaylist: function()
        {
            return this.playlist;
        },
        /**
         * Render the current template
         * 
         * @method
         */
        render: function() {
            this.$el.html(this.template({
                playlist: this.playlist.toJSON()
            }));
        }
    });

    function PlayNext()
    {
        var video = playlistView.getPlaylist().getNextVideo();
        if (video) {
            CurrentPlayer.PlayVideo(video);
        }
    }

    $(function() {

        CurrentPlayer = new VideoPlayers["Youtube"]({ embed: "player" });
        CurrentPlayer.onVideoEnd = function() {
            PlayNext();
        };

        socket = io.connect('http://' + socket_server + '/channel');
        socket.emit('join', { room: room_id });
        socket.on('video', function(data) {
            playlistView.getPlaylist().push(new Video(data));
            if (CurrentPlayer.getState() !== Player.State.PLAYING) {
                PlayNext();
            }
        });

        socket.on('screen_state', function(data) {
            console.log("screen_state", data);
            Screen.setState(data);
        });

        playlistView = new PlayListView({el: $('#playlist')});

        $.getJSON('/playlist/' + room_id, function(data) {
            playlistView.getPlaylist().reset(data.playlist);
        });

        $('#qrcode').qrcode(client_url);

    });

})(document, window, jQuery);