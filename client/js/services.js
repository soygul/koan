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

      // initiate the websocket connection to the host
      api.init = function () {
        var ws = api.ws = new WebSocket(wsHost + '?access_token=' + token),
            wsEvents = api.events.ws = {};

        // create event objects for controllers to subscribe
        wsEvents.connected = event();
        wsEvents.disconnected = event();
        wsEvents.postCreated = event();
        wsEvents.commentCreated = event();

        // add event listeners to the websocket event and publish them to subscribers
        ws.addEventListener('open', function () {
          wsEvents.connected.publish.apply(this, arguments);
          $rootScope.$apply();
        });

        ws.addEventListener('close', function () {
          wsEvents.disconnected.publish.apply(this, arguments);
          $rootScope.$apply();
        });

        ws.addEventListener('message', function (event /* websocket event object */) {
          var data = JSON.parse(event.data /* rpc event object (data) */);
          if (!data.method) {
            throw 'Malformed event data received through WebSocket. Received event data object was: ' + data;
          } else if (!wsEvents[data.method]) {
            throw 'Undefined event type received through WebSocket. Received event data object was: ' + data;
          }
          wsEvents[data.method].publish(data.params);
          $rootScope.$apply();
        });
      };

      // api endpoints
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