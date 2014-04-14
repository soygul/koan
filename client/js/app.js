'use strict';

/**
 * KOAN app level module. This is the root module for all others.
 */

angular
    .module('koan', [
      'ngRoute',
      'monospaced.elastic',
      'koan.home',
      'koan.profile'
    ])
    .config(function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
          .otherwise({
            redirectTo: '/'
          });
    })
    .run(function ($location, $rootScope) {
      $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        // set page title
        $rootScope.layout.title = current.$$route.title;

        // set active menu class for the left navigation (.sidenav)
        var currentCtrl = current.controller.substring(0, current.controller.indexOf('Ctrl')).toLowerCase();
        $rootScope.layout.active[currentCtrl] = 'active';
        if (previous) {
          var previousCtrl = previous.controller.substring(0, previous.controller.indexOf('Ctrl')).toLowerCase();
          delete $rootScope.layout.active[previousCtrl];
        }
      });
    });