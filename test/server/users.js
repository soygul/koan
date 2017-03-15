'use strict';

/* mocha specs for users controller go here */

var mochaConf = require('./mocha.conf'),
    request = mochaConf.request,
    token = mochaConf.token;

describe('Users controller', function () {
  it('POST /users should create a new user', async function () { // mocha goodness
    var res = await request // supertest goodness
        .post('/users')
        .set('Authorization', token)
        .send({name: 'Test User', email: 'test@koan.herokuapp.com'})
        .expect(201);

    res.body.should.have.property('id'); // should.js goodness
  });
});
