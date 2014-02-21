'use strict';

var config = require('./config'),
    fs = require('fs'),
    logger = require('koa-logger'),
    route = require('koa-route'),
    session = require('koa-session'),
    render = require('co-views'),
    parse = require('co-body');

module.exports = function (app) {
  // middleware configuration
  app.keys = ['some secret hurr'];
  app.use(session());
  if (config.app.env !== 'test') {
    app.use(logger());
  }

  // mount all the routes defined in the controllers
  fs.readdirSync('./server/controllers').forEach(function(file) {
    require('./server/controllers/' + file).init(app);
  });
};