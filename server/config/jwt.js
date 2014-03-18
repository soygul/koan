'use strict';

var jwt = module.exports = require('koa-jwt'),
    route = require('koa-route'),
    parse = require('co-body'),
    config = require('./config');

jwt.routes = function (app) {
  app.use(route.post('/login', function *authenticate() {
    var credentials = yield parse(this);
    if (!(credentials.email === 'test@test.com' && credentials.password === 'test')) {
      this.throw(401, 'Wrong user or password');
    }

    var user = {
      id: 123,
      email: 'john@doe.com',
      name: 'John Doe'
    };

    // we are sending the user data inside the token
    var token = jwt.sign(user, config.app.secret, {expiresInMinutes: 60 * 24 * 60});
    this.body = {token: token, user: user};
  }));
};