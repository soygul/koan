'use strict';

/* Services */

angular.module('koan.services', [])
    .factory('authInterceptor', function ($rootScope, $q, $window) {
      return {
        request: function (config) {
          config.headers = config.headers || {};
          if ($window.sessionStorage.token || $window.localStorage.token) {
            config.headers.Authorization = 'Bearer ' + ($window.sessionStorage.token || $window.localStorage.token);
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
    }).factory('$api', function ($rootScope, $http) {
      /**
       * HTTP service providing access the KOAN backend API.
       */
      var apiBase = 'api';
      return {
        posts: {
          list: function () {
            return $http({method: 'GET', url: apiBase + '/posts'});
          }
        }
      };
    });