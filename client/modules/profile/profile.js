'use strict';

// Declare app level module which depends on filters, and services
angular
    .module('koan.profile', [])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/profile', {
            title: 'User Profile',
            templateUrl: 'modules/profile/profile.html',
            controller: 'ProfileCtrl'
          });
    });