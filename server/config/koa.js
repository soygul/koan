'use strict';

var fs = require('fs'),
    logger = require('koa-logger'),
    serve = require('koa-static'),
    jwt = require('./jwt'),
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
  passport.routes(app);

  // mount jwt authentication uri
  jwt.routes(app);

  // serve the angular static files from the /client directory, use caching (7 days) only in production
  app.use(serve('client', config.app.env === 'production' ? {maxage: 1000 * 60 * 60 * 24 * 7} : null));

  // middleware below this line is only reached if jwt token is valid
  app.use(jwt({secret: config.app.secret}));

  // mount all the routes defined in the api controllers
  fs.readdirSync('./server/controllers').forEach(function (file) {
    require('../controllers/' + file).init(app);
  });
};