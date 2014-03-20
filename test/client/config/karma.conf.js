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

    autoWatch: false,

    singleRun: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    reporters: ['dots']
  });
};
