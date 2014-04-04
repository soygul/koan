'use strict';

var fs = require('fs');

module.exports = function (grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      test: {
        NODE_ENV: 'test'
      }
    },
    watch: {
      client: {
        files: ['client/**', '!client/bower_components/**'],
        options: {
          livereload: true
        }
      },
      server: {
        files: ['.nodemon'],
        options: {
          livereload: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          nodeArgs: ['--debug', '--harmony'],
          ignore: ['node_modules/**', 'client/**'],
          callback: function (nodemon) {
            fs.writeFileSync('.nodemon', 'started');
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
            nodemon.on('restart', function () {
              setTimeout(function () {
                fs.writeFileSync('.nodemon', 'restarted');
              }, 250);
            });
          }
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['test/server/mocha/**/*.js']
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

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-env');

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', ['concurrent']);

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};