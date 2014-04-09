'use strict';

/**
 * Home module for displaying home page content.
 */

angular
    .module('koan.home', [])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/', {
            title: 'KOAN Home',
            templateUrl: 'modules/home/home.html',
            controller: 'HomeCtrl'
          });
    });