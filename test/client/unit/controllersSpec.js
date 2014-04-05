'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {

  beforeEach(module('koan.controllers'));

  /**
   * Layout controller tests.
   */
  describe('layout controller', function () {
    var ctrl, scope, $window, api;

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      $window = {sessionStorage: {user: '{"id":5}'}};
      api = {connected: {subscribe: function (fn) {this.cb = fn;}}, disconnected: {subscribe: function (fn) {this.cb = fn;}}};
      ctrl = $controller('layout', {$scope: scope, $window: $window, $route: {}, api: api});
    }));

    it('should be defined', function () {
      expect(ctrl).toBeDefined();
    });

    it('should have "layout" object defined in scope along with "user" info', function () {
      expect(ctrl).toBeDefined();
      expect(scope.layout).toBeDefined();
      expect(scope.layout.active).toBeDefined();
      expect(scope.layout.user.id).toBe(5);
    });

    it('should be subscribed to api connected/disconnected (WebSocket) events', function () {
      expect(api.connected.cb).toBeDefined();
      expect(api.disconnected.cb).toBeDefined();
    });
  });


  /**
   * Profile controller tests.
   */
  describe('profile controller', function () {
    var ctrl, scope, $window, api;

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      scope.layout = {user: {id: 7}};
      ctrl = $controller('profile', {$scope: scope});
    }));

    it('should have "user" object defined in scope', function () {
      expect(scope.user.id).toBe(7);
    });
  });

});
