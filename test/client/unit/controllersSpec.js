'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {

  beforeEach(module('koan.controllers'));

  describe('layout controller', function () {
    var ctrl, scope, $window, api;

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      $window = {sessionStorage: {user: '{}'}};
      api = {connected: {subscribe: function () {}}, disconnected: {subscribe: function () {}}};
      ctrl = $controller('layout', {$scope: scope, $window: $window, $route: {}, api: api});
    }));

    it('should set defined', function () {
      expect(ctrl).toBeDefined();
    });
  });

  it('should ....', inject(function() {
    //spec body
  }));

  it('should ....', inject(function() {
    //spec body
  }));
});
