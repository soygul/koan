'use strict';

/* Services */

angular.module('koan.services', [])
    .value('version', '1.0')
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
      var ws = api.ws = new WebSocket(wsHost + '?access_token=' + token);

      // utilize jQuery's callbacks as an event system
      function event() {
        var callbacks = $.Callbacks();
        return {
          subscribe: callbacks.add,
          unsubscribe: callbacks.remove,
          publish: callbacks.fire /* todo: mod this to be publish($scope, fn) to support auto unsubscribe on ctrl destruction w/ $scope.$on('$destroy', fn); */
        };
      }

      // websocket connected disconnected events
      api.connected = event();
      ws.addEventListener('open', function () {
        api.connected.publish.apply(this, arguments);
        $rootScope.$apply();
      });

      api.disconnected = event();
      ws.addEventListener('close', function () {
        api.disconnected.publish.apply(this, arguments);
        $rootScope.$apply();
      });

      // api http endpoints and websocket events
      api.posts = {
        list: function () {
          return $http({method: 'GET', url: apiBase + '/posts', headers: headers});
        },
        create: function (post) {
          return $http({method: 'POST', url: apiBase + '/posts', data: post, headers: headers});
        },
        created: event(),
        comments: {
          create: function (postId, comment) {
            return $http({method: 'POST', url: apiBase + '/posts/' + postId + '/comments', data: comment, headers: headers});
          },
          created: event()
        }
      };

      ws.addEventListener('message', function (event /* websocket event object */) {
        var data = JSON.parse(event.data /* rpc event object (data) */);
        if (!data.method) {
          throw 'Malformed event data received through WebSocket. Received event data object was: ' + data;
        } else if (!api[data.method]) {
          throw 'Undefined event type received through WebSocket. Received event data object was: ' + data;
        }
        api[data.method].publish(data.params);
        $rootScope.$apply();
      });

      return api;
    });