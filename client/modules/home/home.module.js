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
            template: '<home></home>',
            menuItem: 'home'
          });
    });