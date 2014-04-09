'use strict';

// Declare app level module which depends on filters, and services
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
        // set title and description
        $rootScope.layout.title = current.$$route.title;

        // set active menu item
        var currentCtrl = current.controller;
        $rootScope.layout.active[currentCtrl] = 'active';
        if (previous) {
          var previousCtrl = previous.controller;
          delete $rootScope.layout.active[previousCtrl];
        }
      });
    });