'use strict';

/**
 * Controller for managing the chat box functionality shown on the right hand side of the screen.
 */

angular.module('koan').controller('ChatBoxCtrl', function ($scope, api) {
  // subscribe to websocket events to receive new messages
  api.messages.created.subscribe($scope, function (message) {
    $scope.messages.push(message);
  });
});