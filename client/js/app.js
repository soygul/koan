'use strict';

// Declare app level module which depends on filters, and services
angular.module('koan', [
      'ngRoute',
      'koan.filters',
      'koan.services',
      'koan.directives',
      'koan.controllers'
    ]).
    config(function ($routeProvider, $locationProvider, $httpProvider) {
      $locationProvider.html5Mode(true);
      $httpProvider.interceptors.push('authInterceptor');
      $routeProvider
          .when('/', {
            title: 'KOAN Home',
            templateUrl: 'partials/home.html',
            controller: 'home'
          })
          .when('/profile', {
            templateUrl: 'partials/profile.html',
            controller: 'profile'
          })
          .otherwise({
            redirectTo: '/'
          });
    }).run(function ($location, $rootScope) {
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