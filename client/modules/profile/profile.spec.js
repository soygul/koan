'use strict';

/**
 * Jasmine specs for koan.profile module unit tests.
 */

describe('controllers', function () {

  beforeEach(module('koan'));

  describe('ProfileCtrl controller', function () {

    var ctrl, scope, $window, api;

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      scope.layout = {user: {id: 7}};
      ctrl = $controller('ProfileCtrl', {$scope: scope});
    }));

    it('should have "user" object defined in scope', function () {
      expect(scope.user.id).toBe(7);
    });

  });

});
