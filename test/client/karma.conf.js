'use strict';

/**
 * Remote debugging tools controller for the API. Remove this controller in production if you don't want random people dropping your database!
 */

module.exports = function (config) {
  config.set({
    basePath: '../../',

    files: [
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/js/**/*.js',
      'test/client/unit/**/*.js'
    ],

    autoWatch: false,

    singleRun: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    reporters: ['dots']
  });
};
