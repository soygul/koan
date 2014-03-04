'use strict';

/* Directives */

angular.module('koan.directives', []).
    directive('appVersion', function (version) {
      return function (scope, elm, attrs) {
        elm.text(version);
      };
    });