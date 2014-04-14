'use strict';

module.exports = function (config) {
  config.set({
    basePath: '../../',

    files: [
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-elastic/elastic.js',
      'client/app.js',
      'client/modules/**/!(*-*).js',
      'client/modules/**/*.js'
    ],

    autoWatch: false,

    singleRun: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    reporters: ['dots']
  });
};
