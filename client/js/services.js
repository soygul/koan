'use strict';

/* Services */

angular.module('koan.services', [])
    .factory('$api', function ($rootScope, $http, $window) {
      /**
       * HTTP service providing access the KOAN backend API.
       */
      var apiBase = 'api',
          headers = {Authorization: 'Bearer ' + ($window.sessionStorage.token || $window.localStorage.token)};
      return {
        posts: {
          list: function () {
            return $http({method: 'GET', url: apiBase + '/posts', headers: headers});
          }
        }
      };
    });