'use strict';

var config = require('./config'),
    fs = require('fs'),
    logger = require('koa-logger'),
    session = require('koa-session'),
    route = require('koa-route'),
    render = require('./render');

module.exports = function (app) {
  // middleware configuration
  app.keys = ['some_secret'];
  app.use(session());
  if (config.app.env !== 'test') {
    app.use(logger());
  }

  // mount the angular partial routes

  // mount the angular app route
  app.use(route.get('/*', function *() {
    this.body = yield render('index', {user: this.user});
  }));

  // mount all the routes defined in the api controllers
  fs.readdirSync('./server/controllers').forEach(function(file) {
    require('../controllers/' + file).init(app);
  });
};