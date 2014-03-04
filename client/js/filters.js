'use strict';

/* Filters */

angular.module('koan.filters', []).
    filter('interpolate', function (version) {
      return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
    });