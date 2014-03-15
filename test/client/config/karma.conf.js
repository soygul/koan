module.exports = function (config) {
  config.set({
    basePath: '../../../',

    files: [
      'client/bower_components/angular/angular.js',
      'client/bower_components/**/angular-*.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/js/**/*.js',
      'test/client/unit/**/*.js'
    ],

    exclude: [
      'client/bower_components/angular-loader/angular-loader.js',
      'client/bower_components/**/*.min.js',
      'client/bower_components/angular-scenario/angular-scenario.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    plugins: [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    // Continuous Integration mode
    // If true, it capture browsers, run tests and exit
    singleRun: true

  });
};
