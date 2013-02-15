(function(document, window) {
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
     * A reference to the Youtubeplayer
     *
     * @property {DocumentElement}
     */
    YoutubePlayer.prototype.player = null;

    /**
     * The current state of the player
     *
     * @property {integer}
     */
    YoutubePlayer.prototype.currentState = Player.State.ENDED;

    /**
     * @method
     * @param {String} elementId elementId where the player should be created
     */
    YoutubePlayer.prototype.embed = function(elementId) {

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

            window.onStateChange = function(newState) {
                console.log("state", newState)
                switch (newState) {
                    case Youtube.PlayerState.ENDED:
                        me.setState(Player.State.ENDED);
                        me.onVideoEnd();
                        break;
                    case Youtube.PlayerState.PLAYING:
                        me.setState(Player.State.PLAYING);
                        break;
                    case Youtube.PlayerState.PAUSED:
                        console.log("no state found");
                        me.setState(Player.State.PAUSED);
                        break;
                    case Youtube.PlayerState.BUFFERING:
                        me.setState(Player.State.BUFFERING);
                        break;
                }
            };
        };
    };

    /**
     * Callback when the player is ready
     *
     * @method
     */
    YoutubePlayer.prototype.onReady = function(){};

    /**
     * Callback when a video ends
     *
     * @method
     */
    YoutubePlayer.prototype.onVideoEnd = function(){};


    /**
     * Callback whenever a state changes
     *
     * @method
     * @param {integer} newState The new state the player will be in
     */
    YoutubePlayer.prototype.onStateChange = function(newState) {};


    /**
     * Returns the current state of the player
     *
     * @return {integer}
     */
    YoutubePlayer.prototype.getState = function() {
        return this.currentState;
    };

    /**
     * Set the current state
     */
    YoutubePlayer.prototype.setState = function(newState) {
        console.log("got new state");
        this.currentState = newState;
        this.onStateChange(newState)
    };

    /**
     * Set the volume of the player
     *
     * @param {integer} volume Volume between 0-100
     * @method
     */
    YoutubePlayer.prototype.setVolume = function(volume) {
        if (this.player) {
            this.player.setVolume(volume);
        }
    };

    /**
     * Play a video
     *
     * @param {Video} video
     */
    YoutubePlayer.prototype.PlayVideo = function(video) {
        console.log("loading video", video, this.player)
        if (this.player) {
            this.player.loadVideoById({
                videoId: video.get('id'),
                suggestedQuality: Youtube.PlaybackQuality.HD720
            });
        }
    };


    /**
     * Pause the current player
     */
    YoutubePlayer.prototype.Pause = function() {
        if (this.player) {
            this.player.pauseVideo();
        }
    };

    VideoPlayers.Youtube = YoutubePlayer;

})(document, window);