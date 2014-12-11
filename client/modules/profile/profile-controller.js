'use strict';

/**
 * Profile controller gives the user the means to view/edit their public profile info.
 */

angular.module('koan.profile').controller('ProfileCtrl', function ($scope) {
  // 'common' variable is always added to the root scope and it contains common things like user info, common functions etc.
  $scope.user = $scope.common.user /* this is not needed actually. we can always directly use {{common.user}} variable directly in any view */;
});