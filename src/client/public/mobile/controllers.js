angular.module('youtubedj.controllers', [])

.controller('SearchCtrl', function($scope, $http) {

    $scope.results = [];

    $scope.searchQuery = '';

    $scope.doSearch = function(query) {
        $http
            .get('/search', { params: { q: query }})
            .success(function(result){
                $scope.results = result.data;
            });
    };

    $scope.playSong = function(data) {
        socket.emit('video', {
            title: data.title,
            image: data.thumbnail.hqDefault,
            id: data.id
        });
    }

})

.controller('SettingsCtrl', function($scope) {
    
    $scope.state = {
        qrcode: false,
        fullscreen: true,
        volume: 50
    };

    $scope.sendState = function(state) {
        socket.emit('screen_state', state);
    };
});