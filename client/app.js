'use strict';

/**
 * Top level module. Lists all the other modules as dependencies.
 */

angular
    .module('koan', [
      'ngRoute',
      'angular-loading-bar',
      'koan.common',
      'koan.home',
      'koan.profile'
    ])

    .config(function ($routeProvider, $locationProvider, cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 500;//ms
      $locationProvider.html5Mode(true);
      $routeProvider
          .otherwise({
            redirectTo: '/'
          });
    })

    .run(function ($location, $rootScope, $window, $route, api) {
      // attach commonly used info to root scope to be available to all components/views
      var common = $rootScope.common = $rootScope.common || {
        active: {},
        user: JSON.parse($window.sessionStorage.user || $window.localStorage.user),
        logout: function () {
          delete $window.sessionStorage.token;
          delete $window.sessionStorage.user;
          delete $window.localStorage.token;
          delete $window.localStorage.user;
          $window.location.replace('/login.html');
        },
        clearDatabase: function () {
          var self = this;
          api.debug.clearDatabase().success(function () {
            self.logout();
          });
        }
      };

      // declare websocket event listeners for backend api
      api.connected.subscribe(function () {
        common.onlineIndicatorStyle = {'background-color': 'green'};
      });

      api.disconnected.subscribe(function () {
        common.onlineIndicatorStyle = {'background-color': 'lightgrey'};
      });

      // set actions to be taken each time the user navigates
      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        // set page title
        $rootScope.common.title = current.title;

        // set active menu class for the left navigation (.sidenav)
        $rootScope.common.active[current.menuItem] = 'active';
        if (previous) {
          delete $rootScope.common.active[previous.menuItem];
        }
      });
    });