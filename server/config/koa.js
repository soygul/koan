'use strict';

var config = require('./config'),
    fs = require('fs'),
    logger = require('koa-logger'),
    session = require('koa-session');

module.exports = function (app) {
  // middleware configuration
  app.keys = ['some_secret'];
  app.use(session());
  if (config.app.env !== 'test') {
    app.use(logger());
  }

  // mount all the routes defined in the controllers
  fs.readdirSync('./server/controllers').forEach(function(file) {
    require('../controllers/' + file).init(app);
  });
};