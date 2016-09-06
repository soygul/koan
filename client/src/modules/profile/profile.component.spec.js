'use strict';

/**
 * Jasmine specs (unit tests) for profile controller.
 */

describe('Profile controller', function () {

  var ctrl, $scope;

  beforeEach(module('koan.profile'));

  beforeEach(inject(function ($rootScope, $componentController) {
    $scope = $rootScope.$new();
    $scope.common = {user: {id: 7}};
    ctrl = $componentController('profile', {$rootScope: $scope});
  }));

  it('should have "user" object defined in scope', function () {
    expect(ctrl.user.id).toBe(7);
  });

});
