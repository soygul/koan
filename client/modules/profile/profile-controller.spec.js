'use strict';

/**
 *  Jasmine specs for profile controller unit testing.
 */

describe('ProfileCtrl controller', function () {

  var ctrl, scope, $window, api;

  beforeEach(module('koan.profile'));

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    scope.common = {user: {id: 7}};
    ctrl = $controller('ProfileCtrl', {$scope: scope});
  }));

  it('should have "user" object defined in scope', function () {
    expect(scope.user.id).toBe(7);
  });

});
