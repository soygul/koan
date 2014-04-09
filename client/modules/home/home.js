'use strict';

// Declare app level module which depends on filters, and services
angular
    .module('koan.home', [])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/', {
            title: 'KOAN Home',
            templateUrl: 'partials/home.html',
            controller: 'home'
          });
    });