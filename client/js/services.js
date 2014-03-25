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
          create: function (post) {
            return $http({method: 'POST', url: apiBase + '/posts', data: post, headers: headers});
          }
        },
        comments: {
          create: function (postId, comment) {
            return $http({method: 'POST', url: apiBase + '/posts/' + postId + '/comments', data: comment, headers: headers});
          }
        }
      };
    });