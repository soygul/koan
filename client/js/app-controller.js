'use strict';

/**
 * layout controller is always invoked once, regardless of the given route, to prepare the UI layout variables (like user profile info, active route name, etc.)
 */

angular.module('koan').controller('layout', function ($rootScope, $window, $route, api) {

  var layout = $rootScope.layout = $rootScope.layout || {
    active: {},
    user: JSON.parse($window.sessionStorage.user || $window.localStorage.user),
    logout: function () {
      delete $window.sessionStorage.token;
      delete $window.sessionStorage.user;
      delete $window.localStorage.token;
      delete $window.localStorage.user;
      $window.location.replace('/login.html');
    },
    flushDatabase: function () {
      api.debug.flushDatabase().success(function () {
        $route.reload();
      });
    }
  };

  // declare websocket event listeners for backend api
  api.connected.subscribe(function () {
    layout.onlineIndicatorStyle = {'background-color': 'green'};
  });

  api.disconnected.subscribe(function () {
    layout.onlineIndicatorStyle = {'background-color': 'lightgrey'};
  });
});