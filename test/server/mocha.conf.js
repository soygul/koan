'use strict';

var app = require('../../app');

// initiate KOAN server before each test is run
console.log('Mocha starting to run server tests');
beforeEach(function(done){
  app.init(done);
});

// close the server after each test is done
afterEach(function(done){
  app.server.close(done);
});