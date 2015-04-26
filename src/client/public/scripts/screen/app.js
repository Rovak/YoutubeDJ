var djscreen = angular.module('djscreen', ['monospaced.qrcode']);

djscreen.factory('youtubeplayer', function() {
    "use strict";

    window.Youtube = {
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


    /**
     * @class VideoPlayers.Youtube
     */
    var YoutubePlayer = function(data) {
        data = data || {};

        if (data.embed) {
            this.embed(data.embed);
        }
    };

    /**
     * @event ready
     * Triggers when the Youtube players is fully loaded and ready to use
     */
    /**
     * @event statechange
     * Triggers when the state of the player changes
     * @param {Number} state New player state
     */
    _.extend(YoutubePlayer.prototype, {

        /**
         * A reference to the Youtubeplayer
         *
         * @property {DocumentElement}
         * @protected
         */
        player: null,

        /**
         * The current state of the player
         *
         * @property {Number}
         * @protected
         */
        currentState: Youtube.PlayerState.ENDED,

        /**
         * @method
         * @param {String} elementId elementId where the player should be created
         */
        embed: function(elementId) {

            var me      = this,
                params  = { allowScriptAccess: "always" },
                atts    = { id: elementId };

            swfobject.embedSWF(
                "http://www.youtube.com/apiplayer?enablejsapi=1&version=3",
                elementId, "100%", "100%", "8", null, null, params, atts);

             // Hook into the onReady callback of the youtube player
             window.onYouTubePlayerReady = function() {

                me.player = document.getElementById(elementId);
                me.player.addEventListener("onStateChange", "onStateChange");

                window.onStateChange = function(newState) {
                    me.setState(newState)
                };
            };
        },


        /**
         * Returns the current state of the player
         *
         * @method
         * @return {integer}
         */
        getState: function() {
            return this.currentState;
        },

        /**
         * Set the current state
         * @method
         */
        setState: function(newState) {
            this.currentState = newState;
        },

        /**
         * Set the volume of the player
         *
         * @method
         * @param {integer} volume Volume between 0-100
         */
        setVolume: function(volume) {
            if (this.player) {
                this.player.setVolume(volume);
            }
        },

        /**
         * Play a video
         *
         * @method
         * @param {Video} video
         */
        PlayVideo: function(video) {
            if (this.player) {
                this.player.loadVideoById({
                    videoId: video.get('id'),
                    suggestedQuality: Youtube.PlaybackQuality.HD720
                });
            }
        },

        /**
         * @method
         * Pause the current player
         */
        Pause: function() {
            if (this.player) {
                this.player.pauseVideo();
            }
        }
    });

    var newPlayer = new YoutubePlayer({ 
        embed: 'player'
    });

    return newPlayer;
});


djscreen.service('connection', function($rootScope) {

    var socket = io.connect('http://' + socket_server + '/channel');
    socket.emit('join', {room: room_id});
    socket.on('screen_state', function(data) {
        $rootScope.$broadcast('screen.state', data);
    });

    return {
        on: function(name, func) {
            socket.on(name, func);  
        }
    };
});

djscreen.controller('screen', function($scope, connection) {

    $scope.qrcode = client_url;

    $scope.bodyClass = '';

    $scope.$on('screen.state', function(ev, data) {
        $scope.$apply(function(){ 
            $scope.updateState(data);
        });
    });

    $scope.showQrCode = true;
    $scope.showFullscreen = false;

    $scope.updateState = function(state) {
        for (var key in state) {
            var value = state[key];
            switch (key) {
                case 'qrcode':
                    $scope.showQrCode = value;
                    break;
                case 'fullscreen':
                    $scope.showFullscreen = value;
                    break;
                case 'volume':
                    //CurrentPlayer.setVolume(value);
                    break;
                case 'next':
                    //playNext();
                    break;
                case 'pause':
                    //CurrentPlayer.Pause();
                    break;

            }
        }
    };

});

/**
 * DJ Screen
 */
djscreen.controller('playlistCtrl', function($scope, $http, connection, youtubeplayer) {

    $scope.playlist = [];

    $scope.load = function() {
        $http
            .get('/playlist/' + room_id)
            .success(function(result){
                $scope.playlist = result.playlist;
            });
    };

    $scope.getNextVideo = function() {
        return $scope.playlist.shift();
    };

    connection.on('video', function(data) {
        $scope.$apply(function() {
            $scope.playlist.push(data);
            console.log($scope.playlist);
            if (youtubeplayer.getState() !== Youtube.PlayerState.PLAYING) {
                $scope.playNext();
            }    
        });
    });

    $scope.playNext = function() {
        var video = $scope.getNextVideo();
        if (video) {
            youtubeplayer.player.loadVideoById({
                videoId: video.id,
                suggestedQuality: Youtube.PlaybackQuality.HD720
            });
        }
    };

    $scope.load();
});
