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
  app.use(route.post('/authenticate', function *authenticate() {
    var credentials = yield parse(this);
    if (!(credentials.username === 'test' && credentials.password === 'test')) {
      this.throw(401, 'Wrong user or password');
    }

    var profile = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@doe.com',
      id: 123
    };

    // We are sending the profile inside the token
    var token = require('jsonwebtoken').sign(profile, 'shared-secret', {expiresInMinutes: 60 * 5});
    this.body = token;
  }));

  // mount the angular static resources route, use caching (7 days) only in production
  app.use(serve('client', config.app.env === 'production' ? null : {maxage: 1000 * 60 * 60 * 24 * 7}));

  // middleware below this line is only reached if jwt token is valid
  app.use(route.get('/api', jwt({secret: 'shared-secret'}))); // todo: use route.all when available

  // mount all the routes defined in the api controllers
  fs.readdirSync('./server/controllers').forEach(function (file) {
    require('../controllers/' + file).init(app);
  });
};