'use strict';

var fs = require('fs'),
    logger = require('koa-logger'),
    send = require('koa-send'),
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
  // if the file is not found and requested path is not /api, serve index.html page and let angular handle routing
  var sendOpts = config.app.env === 'production' ? {root: 'client', maxage: 1000 * 60 * 60 * 24 * 7} : {root: 'client'};
  app.use(function *(next) {
    if (this.path.substr(0, 5).toLowerCase() === '/api/') {
      yield next;
    } else {
      if (yield send(this, this.path, sendOpts)) {
        return;
      }
      yield send(this, '/index.html', sendOpts);
    }
  });

  // middleware below this line is only reached if jwt token is valid
  app.use(jwt({secret: config.app.secret}));

  // mount all the routes defined in the api controllers
  fs.readdirSync('./server/controllers').forEach(function (file) {
    require('../controllers/' + file).init(app);
  });
};