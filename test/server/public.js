'use strict';

/* mocha specs for public controller go here */

var mochaConf = require('./mocha.conf'),
    request = mochaConf.request;

describe('Public controller', function () {
  it('/users/:id/picture route should return user image', async function () {
    await request
        .get('/users/1/picture')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
  });
});
