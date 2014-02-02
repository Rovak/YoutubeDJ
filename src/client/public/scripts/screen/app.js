var djscreen = angular.module('djscreen', ['monospaced.qrcode']);

/**
 * Socket.IO Connection
 */
djscreen.factory('connection', ['$rootScope', function($rootScope) {

    var socket = io.connect('http://' + socket_server + '/channel');
    socket.emit('join', {room: room_id});

    return socket;
}]);

djscreen.directive('youtube', [function () {
    return {
        restrict:'A',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, ngModel) {
            var me          = this,
                elementId   = 'youtube-player-1',
                params      = { allowScriptAccess: "always" },
                attrs       = { id: elementId };

            element.context.id = elementId;

            swfobject.embedSWF(
                "http://www.youtube.com/apiplayer?enablejsapi=1&version=3",
                elementId, "100%", "100%", "8", null, null, params, attrs);

             // Hook into the onReady callback of the youtube player
             window.onYouTubePlayerReady = function() {
                me.player = document.getElementById(elementId);
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
        }
    };
}]);

/**
 * DJ Screen Controller
 */
djscreen.controller('screen', function($scope, connection) {

    $scope.qrcode = client_url;

    $scope.bodyClass = '';

    connection.on('screen_state', function(data) {
        $scope.updateState(data);
    });

    connection.on('video', function(data) {
        playlistView.getPlaylist().push(new Video(data));
        if (CurrentPlayer.getState() !== Player.State.PLAYING) {
            playNext();
        }
    });

    $scope.player = {
        video: 'asdfasf'
    };

    $scope.showQrCode = true;

    $scope.showFullscreen = true;

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

        $scope.$apply(function(){
            if (!$scope.showQrCode) {
                bodyClass += ' hide-qr';
            }
            if ($scope.showFullscreen) bodyClass += ' fullscreen';
            $scope.bodyClass = bodyClass;
            console.log(bodyClass);
        });
    };
});

/**
 * DJ Screen
 */
djscreen.controller('playlist', function($scope) {

    $scope.playlist = [
        { title: 'test', image: 'etsf' }
    ];
});