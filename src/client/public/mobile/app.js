angular.module('youtubedj', ['ionic', 'youtubedj.controllers'])


.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('tabs', {
    url: '/tab',
    abstract: true,
    templateUrl: '/templates/tabs.html'
  })

  // setup an abstract state for the tabs directive
  .state('tabs.search', {
      url: "/search",
      views: {
        'search-tab' :{
          templateUrl: '/templates/search.html',
          controller: 'SearchCtrl'        
        }
      }
    })

  // Each tab has its own nav history stack:

  .state('tabs.settings', {
    url: '/settings',
    views: {
      'settings-tab' :{
        templateUrl: '/templates/settings.html',
        controller: 'SettingsCtrl'        
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/search');

});
