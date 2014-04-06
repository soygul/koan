'use strict';

/* mocha specs for users controller go here */

var mochaConf = require('./mocha.conf'),
    request = mochaConf.request,
    token = mochaConf.token;

describe('Users controller', function () {
  it('POST /users should create a new user', function (done) {
    request
        .post('/users')
        .set('Authorization', token)
        .send({name: 'Test User', email: 'test@koanjs.com'})
        .expect(201, done);
  });
});
