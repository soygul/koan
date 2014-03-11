'use strict';

var fs = require('fs'),
    logger = require('koa-logger'),
    route = require('koa-route'),
    parse = require('co-body'),
    serve = require('koa-static'),
    jwt = require('koa-jwt'),
    config = require('./config'),
    passport = require('./passport');

module.exports = function (app) {
  // middleware configuration
  if (config.app.env !== 'test') {
    app.use(logger());
  }
  app.use(passport.initialize());
  app.use(passport.session());

  // mount passport oauth routes
  app.use(route.get('/login/facebook', function *() {
    passport.authenticate('facebook');
  }));

  app.use(route.get('/login/facebook/callback', function *() {
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    });
  }));

  // mount jwt authentication uri
  app.use(route.post('/login', function *authenticate() {
    var credentials = yield parse(this);
    if (!(credentials.email === 'test@test.com' && credentials.password === 'test')) {
      this.throw(401, 'Wrong user or password');
    }

    var user = {
      id: 123,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@doe.com'
    };

    // we are sending the user data inside the token
    var token = require('jsonwebtoken').sign(user, 'shared-secret', {expiresInMinutes: 60 * 24 * 60});
    this.body = {token: token};
  }));

  // mount the angular static resources route, use caching (7 days) only in production
  app.use(serve('client', config.app.env === 'production' ? {maxage: 1000 * 60 * 60 * 24 * 7} : null));

  // middleware below this line is only reached if jwt token is valid
  app.use(jwt({secret: 'shared-secret'}));

  app.use(route.get('/api/restricted', function *() {
    console.log('user ' + this.user.email + ' is calling /api/restricted');
    this.body = {name: 'foo'};
  }));

  // mount all the routes defined in the api controllers
  fs.readdirSync('./server/controllers').forEach(function (file) {
    require('../controllers/' + file).init(app);
  });
};