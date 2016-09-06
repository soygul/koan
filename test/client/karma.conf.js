'use strict';

module.exports = function (config) {
  config.set({
    basePath: '../../',

    preprocessors: {
      '**/*.html': ['ng-html2js'],
      'client/build/!(bower_components)/**/*.js': 'coverage'
    },

    files: [
      'client/build/bower_components/jquery/dist/jquery.js',
      'client/build/bower_components/lodash/lodash.js',
      'client/build/bower_components/angular/angular.js',
      'client/build/bower_components/angular-animate/angular-animate.js',
      'client/build/bower_components/angular-loading-bar/build/loading-bar.js',
      'client/build/bower_components/angular-route/angular-route.js',
      'client/build/bower_components/angular-mocks/angular-mocks.js',
      'client/build/bower_components/angular-elastic/elastic.js',
      'client/build/app.js',
      'client/build/modules/**/*.module.js',
      'client/build/modules/**/!(.module|.spec).js',
      'client/build/modules/**/*.spec.js'
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
      stripPrefix: 'client/build/'
    }
  });
};
