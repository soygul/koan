'use strict';

var config = require('../../server/config/config'),
    app = require('../../app');

console.log('Mocha starting to run server tests on port ' + config.app.port);

// initiate KOAN server before each test is run
beforeEach(function(done){
  app.init(done);
});

// close the server after each test is done
afterEach(function(done){
  app.server.close(done);
});