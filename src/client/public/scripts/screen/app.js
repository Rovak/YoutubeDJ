var djscreen = angular.module('djscreen', ['monospaced.qrcode']);


djscreen.service('connection', ['$rootScope', function($rootScope) {

    var socket = io.connect('http://' + socket_server + '/channel');
    socket.emit('join', {room: room_id});
    socket.on('video', function(data) {
        playlistView.getPlaylist().push(new Video(data));
        if (CurrentPlayer.getState() !== Player.State.PLAYING) {
            playNext();
        }
    });

    socket.on('screen_state', function(data) {
        $rootScope.$broadcast('screen.state', data);
    });

}]);

djscreen.controller('screen', function($scope, connection) {

    $scope.qrcode = client_url;

    $scope.bodyClass = '';

    $scope.$on('screen.state', function(ev, data) {
        $scope.updateState(data);
    });

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