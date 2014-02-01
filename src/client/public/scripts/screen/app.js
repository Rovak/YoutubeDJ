var djscreen = angular.module('djscreen', ['monospaced.qrcode']);

djscreen.controller('screen', function($scope) {

    $scope.showQRcode = false;

    $scope.qrcode = "test";

    $scope.bodyClass = 'hide-qr';

    $scope.updateState = function(state) {
        var bodyClass = '';
        for (var key in state) {
            var value = state[key];
            switch (key) {
                case 'qrcode':
                    if (!value) bodyClass += ' hide-qr';
                    break;
                case 'fullscreen':
                    if (value) bodyClass += ' fullscreen';
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
djscreen.controller('playlist', function($scope) {

    $scope.playlist = [
        { title: 'test', image: 'etsf' }
    ];
});