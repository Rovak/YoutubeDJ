(function() {

    var djscreen = angular.module('djscreen', ['monospaced.qrcode']);

    /**
     * Socket.IO Connection
     */
    djscreen.factory('connection', ['$rootScope', function($rootScope) {

        var socket = io.connect('http://' + socket_server + '/channel');
        socket.emit('join', {room: room_id});

        return socket;
    }]);

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

    var Player = {
        State: {
            ENDED: 0,
            PLAYING: 1,
            PAUSED: 2,
            BUFFERING: 3
        }
    };

    djscreen.directive('youtube', [function () {

        return {
            restrict:'A',
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            link: function (scope, element, ngModel) {
                var me          = this,
                    elementId   = 'youtubeplayer_1',
                    params      = { allowScriptAccess: "always" },
                    attrs       = { id: elementId },
                    isReady     = false,
                    player;

                element.context.id = elementId;

                swfobject.embedSWF(
                    "http://www.youtube.com/apiplayer?enablejsapi=1&version=3",
                    elementId, "100%", "100%", "8", null, null, params, attrs);

                scope.$watch('model.video', function(newValue, oldValue) {
                    if (!isReady) return;
                    player.loadVideoById({
                        videoId: newValue.id,
                        suggestedQuality: Youtube.PlaybackQuality.HD720
                    });
                });

                scope.$watch('model.state', function(newValue, oldValue) {
                    if (!isReady) return;
                    switch(newValue) {
                        case Player.State.PAUSED:
                            player.Pause();
                            break;
                    }
                });

                scope.$watch('model.volume', function(newValue, oldValue) {
                    if (!isReady) return;
                    player.setVolume(newValue);
                });

                 // Hook into the onReady callback of the youtube player
                 window.onYouTubePlayerReady = function() {

                    var methodName = elementId + '_onStateChange';

                    player = document.getElementById(elementId);
                    player.addEventListener('onStateChange', methodName);

                    window[methodName] = function(newState) {
                        scope.$apply(function(){
                            switch (newState) {
                                case Youtube.PlayerState.ENDED:
                                    scope.model.state = Player.State.ENDED;
                                    break;
                                case Youtube.PlayerState.PLAYING:
                                    scope.model.state = Player.State.PLAYING;
                                    break;
                                case Youtube.PlayerState.PAUSED:
                                    scope.model.state = Player.State.PAUSED;
                                    break;
                                case Youtube.PlayerState.BUFFERING:
                                    scope.model.state = Player.State.BUFFERING;
                                    break;
                            }
                        });
                    };

                    isReady = true;
                };
            }
        };
    }]);

    /**
     * DJ Screen Controller
     */
    djscreen.controller('screen', function($scope, connection) {

        $scope.qrcode = client_url;

        $scope.bodyClass = '';

        $scope.player = {
            video: 'asdfasf'
        };

        connection.on('screen_state', function(data) {
            $scope.$apply(function() {
                $scope.updateState(data);
            });
        });

        connection.on('video', function(data) {
            $scope.$apply(function() {
                $scope.addVideo(data);
            });
        });

        $scope.showQrCode = true;

        $scope.showFullscreen = true;

        $scope.playlist = [];

        /**
         * Add a new video
         */
        $scope.addVideo = function(video) {
            if ($scope.player.state !== Youtube.PlayerState.PLAYING) {
                $scope.player.video = video;
            } else {
                $scope.playlist.push(video);
            }
        };

        $scope.updateState = function(state) {
            var bodyClass = '';
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
                        $scope.player.volume = value;
                        break;
                    case 'next':
                        if ($scope.playlist.length) {
                            $scope.player.video = $scope.playlist.shift();
                        }
                        break;
                    case 'pause':
                        $scope.player.state = Player.State.PAUSED;
                        break;
                }
            }

            $scope.$apply(function(){
                if (!$scope.showQrCode) {
                    bodyClass += ' hide-qr';
                }
                if ($scope.showFullscreen) bodyClass += ' fullscreen';
                $scope.bodyClass = bodyClass;
            });
        };
    });

    /**
     * DJ Screen
     */
    djscreen.controller('playlist', function($scope, connection) {

    });

})();