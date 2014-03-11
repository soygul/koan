'use strict';

/* Controllers */

angular.module('koan.controllers', [])
    .controller('layout', function ($rootScope, $window, $location) {
      // layout controller is always invoked once, regardless of the given route, to prepare the UI layout variables (like user profile image, display name, online status, etc.)
      var layout = $rootScope.layout = $rootScope.layout || {active: {}, logout: function () {
        delete $window.localStorage.token;
        delete $window.sessionStorage.token;
        $window.location.replace('/login.html');
      }};

      // verify that user is logged in and has a valid token, or our http requests to the backend will 401
      var token = $window.sessionStorage.token || $window.localStorage.token;
      if (token) {
        try {
          var encodedUser = token.split('.')[1];
          // append user data to layout object
          layout.user = JSON.parse(atob(encodedUser));
        } catch (err) {
          // token is invalid..
        }
      }
      if (!token || !layout.user || layout.user.exp < Math.round(new Date().getTime() / 1000)) {
        // token is non-existent, invalid, or expired so redirect to login page
        $window.location.replace('/login.html');
      }
    })
    .controller('home', function () {

    })
    .controller('user', function ($scope, $http, $window) {
      $scope.user = {username: 'test', password: 'test'};
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
    });