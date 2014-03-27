'use strict';

// Declare app level module which depends on filters, and services
angular.module('koan', [
      'ngRoute',
      'monospaced.elastic',
      'koan.filters',
      'koan.services',
      'koan.directives',
      'koan.controllers'
    ])
    .config(function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
          .when('/', {
            title: 'KOAN Home',
            templateUrl: 'partials/home.html',
            controller: 'home'
          })
          .when('/profile', {
            title: 'Profile',
            templateUrl: 'partials/profile.html',
            controller: 'profile'
          })
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