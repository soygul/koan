module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'client/lib/angular/angular.js',
      'client/lib/angular/angular-*.js',
      'test/client/lib/angular/angular-mocks.js',
      'client/js/**/*.js',
      'test/client/unit/**/*.js'
    ],

    exclude : [
      'client/lib/angular/angular-loader.js',
      'client/lib/angular/*.min.js',
      'client/lib/angular/angular-scenario.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
