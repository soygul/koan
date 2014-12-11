'use strict';

/**
 * Home module for displaying home page content.
 */

angular
    .module('koan.home', [
      'ngRoute',
      'monospaced.elastic',
      'koan.common'
    ])
    .config(function ($routeProvider) {
      $routeProvider
          .when('/', {
            title: 'KOAN Home',
            templateUrl: 'modules/home/home.html',
            controller: 'HomeCtrl'
          });
    });