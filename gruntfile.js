'use strict';

var fs = require('fs');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      test: {
        NODE_ENV: 'test'
      }
    },
    mochaTest: {
      server: {
        options: {
          reporter: 'dot',
          require: ['should', 'co-mocha']
        },
        src: ['test/server/**/*.js']
      }
    },
    karma: {
      unit: {
        configFile: 'test/client/karma.conf.js'
      }
    },
    protractor: {
      e2e: {
        configFile: "test/client/protractor.conf.js",
        keepAlive: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('test', ['env:test', 'mochaTest:server', 'karma:unit']);
};