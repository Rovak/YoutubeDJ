(function(document, window) {
    "use strict";

    var socket,
        player,
        previous_state,
        playlistView;

    /**
     * Youtube configuration
     *
     * @type SimpleObject
     */
    var Youtube = {
        PlayerState: {
            UNSTARTED: -1,
            ENDED: 0,
            PLAYING: 1,
            PAUSED: 2,
            BUFFERING: 3,
            CUED: 5
        },
        PlaybackQuality: {
            HD1080: 'hd1080',
            HD720: 'hd720',
            LARGE: 'large',
            MEDIUM: 'medium',
            SMALL: 'small'
        }
    };


    var Screen = (function() {

        return {
            /**
             * Set screen state
             *
             * @param {SimpleObject} state A key-value pair of new screen configuration
             */
            setState: function(state) {
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
                            player.setVolume(value);
                            break;
                        case 'next':
                            playnext();
                            break;
                        case 'pause':
                            player.pauseVideo();
                            break;

                    }
                }
            }
        };
    })();

    function onYouTubePlayerReady() {
        player = document.getElementById("player");
        socket.emit('join', {
            room: room_id
        });
        socket.on('video', function(data) {
            playlistView.getPlaylist().push(new Video(data));
            if (player.getPlayerState() !== Youtube.PlayerState.PLAYING) {
                playnext();
            }
        });

        socket.on('screen_state', function(data) {
            Screen.setState(data);
        });

        player.addEventListener("onStateChange", "onStateChange");
    }

    // onStateChange has to be bound to the document because the
    // youtube player is calling the function in the document scope
    document.onStateChange = function(newState) {
        switch (newState) {
            case Youtube.PlayerState.ENDED:
                playnext();
                break;
        }
        previous_state = newState;
    };

    // Models
    var Video = Backbone.Model.extend({
        defaults: {
            type: 'youtube',
            url: 'test'
        },
        url: '/video',
        initialize: function() {
            console.log('new video!');
        }
    });

    var Playlist = Backbone.Collection.extend({
        model: Video,
        url: 'http://' + app.host + '/playlist',
        id: room_id,
        /**
         * Pop the next video from the playlist
         * @returns {Video}
         */
        getNextVideo: function() {
            return this.shift();
        },
        /**
         * Synchronize the playlist with the backend server
         */
        sync: function(method, model, options) {
            options = options || {};

            var me = this,
                    list = [];

            for (var i in this.models) {
                list.push(this.models[i].toJSON());
            }

            var data = {
                playlist: list
            };


            $.post('/playlist/' + room_id, data, function(data) {
                console.log('response', data);
                me.reset(data.list);
            }, 'json');
        }
    });

    // Views
    var PlayListView = Backbone.View.extend({
        /**
         * Template
         */
        template: Handlebars.compile($("#playlist_template").html()),
        /**
         * @constructor
         */
        initialize: function() {
            this.setPlaylist(new Playlist());
        },
        /**
         * @param {Playlist}
         */
        setPlaylist: function(playlist)
        {
            console.log('changed list', playlist);
            this.playlist = playlist;
            this.playlist.on('change', this.render, this);
            this.playlist.on('add', this.render, this);
            this.playlist.on('remove', this.render, this);
            this.playlist.on('reset', this.render, this);
            this.render();
        },
        /**
         * @return {Playlist}
         */
        getPlaylist: function()
        {
            return this.playlist;
        },
        /**
         * render()
         */
        render: function() {
            this.$el.html(this.template({
                playlist: this.playlist.toJSON()
            }));
        }
    });

    function playnext() {
        var video = playlistView.getPlaylist().getNextVideo();
        if (video) {
            player.loadVideoById({
                videoId: video.get('id'),
                suggestedQuality: Youtube.PlaybackQuality.HD720
            });
        }
    }

    $(function() {

        socket = io.connect('http://' + socket_server + '/channel');

        var player_id = "player";

        var params = {
            allowScriptAccess: "always"
        };
        var atts = { id: player_id };

        swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3",
                player_id, "100%", "100%", "8", null, null, params, atts);

        playlistView = new PlayListView({el: $('#' + player_id)});

        $.getJSON('/playlist/' + room_id, function(data) {
            playlistView.getPlaylist().reset(data.playlist);
        });

        $('#qrcode').qrcode(client_url);
    });

})(document, window);
