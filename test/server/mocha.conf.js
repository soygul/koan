'use strict';

var app = require('../../app');

// initiate KOAN server before each test is run
beforeEach(function(done){
  app.init(done);
});

// close the server after each test is done
beforeEach(function(done){
  app.server.close();
});