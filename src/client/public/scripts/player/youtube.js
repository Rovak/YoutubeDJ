define([
    'backbone',
    'underscore',
    'player/player'
],
function(Backbone, _, Player){
    "use strict"

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
    _.extend(YoutubePlayer.prototype, Backbone.Events, {

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
        currentState: Player.State.ENDED,

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
                me.player = document.getElementById(elementId)
                me.player.addEventListener("onStateChange", "onStateChange");
                me.trigger('ready');

                window.onStateChange = function(newState) {
                    switch (newState) {
                        case Youtube.PlayerState.ENDED:
                            me.setState(Player.State.ENDED);
                            me.trigger('videoend');
                            break;
                        case Youtube.PlayerState.PLAYING:
                            me.setState(Player.State.PLAYING);
                            break;
                        case Youtube.PlayerState.PAUSED:
                            me.setState(Player.State.PAUSED);
                            break;
                        case Youtube.PlayerState.BUFFERING:
                            me.setState(Player.State.BUFFERING);
                            break;
                    }
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
            this.trigger('statechange', newState);
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

    return YoutubePlayer;
});
