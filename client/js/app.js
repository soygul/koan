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
          .when('/user', {
            templateUrl: 'partials/user.html',
            controller: 'user'
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
      $rootScope.$on('$routeChangeStart', function (event, next, current) {
        /*if ( $rootScope.loggedUser == null ) {
         // no logged user, we should be going to #login
         if ( next.templateUrl == "partials/login.html" ) {
         // already going to #login, no redirect needed
         } else {
         // not going to #login, we should redirect now
         $location.path( "/login" );
         }
         }*/

        // actually a better solution would be to load just the user view for the search page.. (which should already be done with login?)
        if (next.controller === 'SearchCtrl' && !$rootScope.layout.user) {
          $location.url('/');
        } else {
          $rootScope.layout.searchQuery = null;
        }
      });
    });