'use strict';

var jwt = module.exports = require('koa-jwt'),
    route = require('koa-route'),
    parse = require('co-body'),
    config = require('./config'),
    mongo = require('./mongo');

jwt.routes = function (app) {
  app.use(route.post('/login', function *authenticate() {
    var credentials = yield parse(this);
    var user = yield mongo.users.findOne({email: credentials.email}, {email: 1, name: 1, password: 1});

    if (!user) {
      this.throw(401, 'Incorrect e-mail address.');
    } else if (user.password !== credentials.password) {
      this.throw(401, 'Incorrect password.');
    } else {
      user.id = user._id;
      delete user._id;
      delete user.password;
      user.picture = 'api/users/' + user.id + '/picture';
    }

    // sign and send the token along with the user info
    var token = jwt.sign(user, config.app.secret, {expiresInMinutes: 60 * 24 * 60});
    this.body = {token: token, user: user};
  }));
};