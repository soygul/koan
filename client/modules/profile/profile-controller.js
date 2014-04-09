'use strict';

/**
 * profile controller gives the user the means to view/edit their public profile info
 */

angular.module('koan.profile').controller('ProfileCtrl', function ($scope) {
  // 'layout' variable is always added to the root scope and it contains common things like user info, common functions etc.
  $scope.user = $scope.layout.user /* this is not needed actually. we can always directly use {{layout.user}} variable directly in any view */;
});