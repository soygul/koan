'use strict';

var config = require('../../server/config/config'),
    app = require('../../app');

// initiate KOAN server before each test is run
console.log('Mocha starting to run server tests on port ' + config.app.port);
beforeEach(function(done){
  app.init(done);
});

// close the server after each test is done
afterEach(function(done){
  app.server.close(done);
});