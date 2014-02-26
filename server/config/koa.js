'use strict';

var config = require('./config'),
    fs = require('fs'),
    logger = require('koa-logger'),
    session = require('koa-session'),
    route = require('koa-route'),
    serve = require('koa-static'),
    render = require('./render'),
    auth = require('../middleware/token-auth');

module.exports = function (app) {
  // middleware configuration
  if (config.app.env !== 'test') {
    app.use(logger());
  }
  app.keys = ['some_secret'];
  app.use(session());
  app.use(auth({path: '/api'}));

  // mount the view routes
  app.use(route.get('/partials/*', function *() {
    var stripped = this.url.split('.')[0];
    var requestedView = require('path').join('./', stripped);
    this.body = yield render(requestedView);
  }));

  // mount the angular static resources route, use caching (14 days) only in production
  app.use(serve('client', config.app.env === 'production' ? null : {maxage: 1000 * 60 * 60 * 24 * 14}));

  // mount all the routes defined in the api controllers
  fs.readdirSync('./server/controllers').forEach(function (file) {
    require('../controllers/' + file).init(app);
  });

  // mount the angular app route, which basically captures all the unhandled routes and redirect them to index
  // if user is not authenticated, login page is displayed
  app.use(route.get('/*', function *() {
    this.body = yield this.user ? render('index', {user: this.user}) : render('unauthed/login');
  }));
};