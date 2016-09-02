'use strict';

/**
 * Profile module for user profile and related content.
 */

angular
    .module('koan.profile', [
      'ngRoute',
      'koan.common'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/profile', {
            title: 'User Profile',
            template: '<profile></profile>',
            menuItem: 'profile'
          });
    });