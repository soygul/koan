'use strict';

/**
 * Controller for managing the chat box functionality shown on the right hand side of the screen.
 */

angular.module('koan').controller('ChatBoxCtrl', function ($scope, api) {
  $scope.messages = [];
  var chatBox = $scope.chatBox = {message: '', disabled: false};

  // subscribe to websocket events to receive new messages
  api.messages.created.subscribe($scope, function (message) {
    $scope.messages.push(message);
  });

  // add message creator function to the scope
  $scope.createMessage = function ($event) {
    // submit the message in the message box only if user hits 'Enter (keycode 13)'
    if ($event.keyCode !== 13) {
      return;
    }

    // don't let the user type in blank lines or submit empty/whitespace only message, or type in something when message is being created
    if (!chatBox.message.length || chatBox.disabled) {
      $event.preventDefault();
      return;
    }

    // disable the message box and push the new message to server
    chatBox.disabled = true;
    api.messages.create({message: chatBox.message})
        .success(function () {
          // clear the message field and enable it
          chatBox.message = '';
          chatBox.disabled = false;
        })
        .error(function () {
          // don't clear the message box but enable it so the user can re-try
          chatBox.disabled = false;
        });

    // prevent default 'Enter' button behavior (create new line) as we want 'Enter' button to do submission
    $event.preventDefault();
  };
});