'use strict';

/**
 * Jasmine specs (unit tests) for profile controller.
 */

describe('Profile controller', function () {

  var ctrl, $scope;

  beforeEach(module('koan.profile'));

  beforeEach(inject(function ($rootScope, $controller) {
    $scope = $rootScope.$new();
    $scope.common = {user: {id: 7}};
    ctrl = $controller('ProfileCtrl', {$scope: $scope});
  }));

  it('should have "user" object defined in scope', function () {
    expect($scope.user.id).toBe(7);
  });

});
