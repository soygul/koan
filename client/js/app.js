'use strict';

// Declare app level module which depends on filters, and services
angular.module('koan', [
      'ngRoute',
      'ngSanitize',
      'koan.filters',
      'koan.services',
      'koan.directives',
      'koan.controllers'
    ]).
    config(function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
          .when('/view1', {
            templateUrl: 'partials/partial1.html',
            controller: 'MyCtrl1'
          })
          .when('/view2', {
            templateUrl: 'partials/partial2.html',
            controller: 'MyCtrl2'
          })
          .otherwise({
            redirectTo: '/view1'
          });
    });
