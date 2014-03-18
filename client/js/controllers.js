'use strict';

/* Controllers */

angular.module('koan.controllers', [])

    .controller('layout', function ($rootScope, $window) {
      /**
       * layout controller is always invoked once, regardless of the given route, to prepare the UI layout variables (like user profile image, display name, online status, etc.)
       */
      var layout = $rootScope.layout = $rootScope.layout || {
        active: {},
        user: JSON.parse($window.sessionStorage.user || $window.localStorage.user),
        logout: function () {
          delete $window.sessionStorage.token;
          delete $window.sessionStorage.user;
          delete $window.localStorage.token;
          delete $window.localStorage.user;
          $window.location.replace('/login.html');
        }
      };
    })

    .controller('home', function () {
      /**
       * home controller simply lists all the posts from everyone on the front page
       */
    })

    .controller('profile', function ($scope, $http, $window) {
      /**
       * profile controller gives the user the means to view/edit their public profile info
       */
      $scope.callRestricted = function () {
        $http({url: '/api/users', method: 'GET'})
            .success(function (data, status, headers, config) {
              $scope.message = data;
            })
            .error(function (data, status, headers, config) {
              alert(data);
            });
      };
    });