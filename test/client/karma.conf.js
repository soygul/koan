'use strict';

module.exports = function (config) {
  config.set({
    basePath: '../../',

    preprocessors: {
      '**/*.html': ['ng-html2js'],
      'client/!(bower_components)/**/*.js': 'coverage'
    },

    files: [
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/lodash/lodash.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-animate/angular-animate.js',
      'client/bower_components/angular-loading-bar/build/loading-bar.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-elastic/elastic.js',
      'client/app.js',
      'client/modules/**/!(*-*).js',
      'client/modules/**/!(*-*-*).js',
      'client/modules/**/!(*-*-*-*).js',
      'client/modules/**/*.js',
      'client/modules/**/*.html'
    ],

    autoWatch: false,

    singleRun: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    reporters: ['dots', 'coverage'],

    coverageReporter: {
      type: 'text-summary'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    }
  });
};
