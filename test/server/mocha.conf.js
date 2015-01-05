'use strict';

var config = require('../../server/config/config'),
    mongoSeed = require('../../server/config/mongo-seed'),
    app = require('../../app'),
    jwt = require('koa-jwt'),
    baseUrl = 'http://localhost:' + config.app.port + '/api',
    supertest = require('co-supertest'),
    request = supertest(baseUrl);

// create a valid jwt token to be sent with every request
var user = mongoSeed.users[1];
var token = jwt.sign({id: user._id, name: user.name, email: user.email}, config.app.secret);
token = 'Bearer ' + token;

// make request and token objects available
exports.request = request;
exports.token = token;

// initiate KOAN server before each test is run
// also drop and re-seed the test database before each run
console.log('Mocha starting to run server tests on port ' + config.app.port);
beforeEach(function *() {
  yield app.init(true);
});

// close the server after each test is done
afterEach(function (done) {
  app.server.close(done);
});