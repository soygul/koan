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
            templateUrl: 'partials/home.html',
            controller: 'home'
          })
          .when('/user', {
            templateUrl: 'partials/user.html',
            controller: 'user'
          })
          .otherwise({
            redirectTo: '/'
          });
    });