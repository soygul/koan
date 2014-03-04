'use strict';

/* Controllers */

angular.module('koan.controllers', []).
    controller('MyCtrl1', function () {

    })
    .controller('MyCtrl2',function () {

    }).controller('UserCtrl',function ($scope, $http, $window) {
      $scope.user = {username: 'john.doe', password: 'foobar'};
      $scope.isAuthenticated = false;
      $scope.welcome = '';
      $scope.message = '';

      $scope.submit = function () {
        $http
            .post('/authenticate', $scope.user)
            .success(function (data, status, headers, config) {
              $window.sessionStorage.token = data.token;
              $scope.isAuthenticated = true;
              var encodedProfile = data.token.split('.')[1];
              var profile = JSON.parse(atob(encodedProfile));
              $scope.welcome = 'Welcome ' + profile.first_name + ' ' + profile.last_name;
            })
            .error(function (data, status, headers, config) {
              // Erase the token if the user fails to log in
              delete $window.sessionStorage.token;
              $scope.isAuthenticated = false;

              // Handle login errors here
              $scope.error = 'Error: Invalid user or password';
              $scope.welcome = '';
            });
      };

      $scope.logout = function () {
        $scope.welcome = '';
        $scope.message = '';
        $scope.isAuthenticated = false;
        delete $window.sessionStorage.token;
      };

      $scope.callRestricted = function () {
        $http({url: '/api/restricted', method: 'GET'})
            .success(function (data, status, headers, config) {
              $scope.message = $scope.message + ' ' + data.name; // Should log 'foo'
            })
            .error(function (data, status, headers, config) {
              alert(data);
            });
      };
    }).factory('authInterceptor',function ($rootScope, $q, $window) {
      return {
        request: function (config) {
          config.headers = config.headers || {};
          if ($window.sessionStorage.token) {
            config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
          }
          return config;
        },
        responseError: function (rejection) {
          if (rejection.status === 401) {
            // handle the case where the user is not authenticated
          }
          return $q.reject(rejection);
        }
      };
    }).config(function ($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    });