'use strict';

/* mocha specs for users controller go here */

var baseUrl = 'http://localhost:3001/api',
    supertest = require('supertest'),
    request = supertest(baseUrl);

describe('Users controller', function () {
  it('/users/:id/picture route should return user image', function (done) {
    request
        .get('/users/1/picture')
        .expect('Content-Type', 'image/jpeg')
        .expect(200, done);
  });
});
