'use strict';

/* Services */

angular.module('koan.services', [])
    .factory('api', function ($rootScope, $http, $window) {
      /**
       * HTTP service providing access the KOAN backend API.
       */
      var apiBase = 'api' /* base api uri */,
          headers = {Authorization: 'Bearer ' + ($window.sessionStorage.token || $window.localStorage.token)};

      return {
        posts: {
          list: function () {
            return $http({method: 'GET', url: apiBase + '/posts', headers: headers});
          },
          create: function (message) {
            return $http({method: 'POST', url: apiBase + '/posts', data: {message: message}, headers: headers});
          }
        },
        comments: {
          create: function (postId, message) {
            return $http({method: 'POST', url: apiBase + '/posts/' + postId + '/comments', data: {message: message}, headers: headers});
          }
        }
      };
    });