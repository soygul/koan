'use strict';

/* Services */

angular.module('koan.services', [])
    .factory('api', function ($rootScope, $http, $window) {
      /**
       * HTTP service providing access the KOAN backend API.
       */
      var apiBase = 'api' /* base api uri */,
          token = ($window.sessionStorage.token || $window.localStorage.token),
          headers = {Authorization: 'Bearer ' + token},
          wsHost = $window.document.location.origin.replace(/^http/, 'ws'),
          api = {events: {}};

      api.init = function () {

      };

      api.posts = {
        list: function () {
          return $http({method: 'GET', url: apiBase + '/posts', headers: headers});
        },
        create: function (post) {
          return $http({method: 'POST', url: apiBase + '/posts', data: post, headers: headers});
        },
        comments: {
          create: function (postId, comment) {
            return $http({method: 'POST', url: apiBase + '/posts/' + postId + '/comments', data: comment, headers: headers});
          }
        }
      };

      // utilize jQuery's callbacks as an event system
      function event() {
        var callbacks = $.Callbacks();
        return {
          subscribe: callbacks.add,
          unsubscribe: callbacks.remove,
          publish: callbacks.fire
        };
      }

      return api;
    });