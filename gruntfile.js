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

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('default', ['concurrent']);

  grunt.registerTask('test', ['env:test', 'mochaTest:server', 'karma:unit']);
};