'use strict';

var fs = require('fs'),
    logger = require('koa-logger'),
    send = require('koa-send'),
    jwt = require('koa-jwt'),
    cors = require('koa-cors'),
    bodyParser = require('koa-bodyparser'),
    config = require('./config');

module.exports = function (app) {
  // middleware configuration
  if (config.app.env !== 'test') {
    app.use(logger());
  }
  if (config.app.env === 'development') {
    app.use(require('koa-livereload')({excludes: ['/modules']}));
  }
  app.use(cors({
    maxAge: config.app.cacheTime / 1000,
    credentials: true,
    methods: 'GET, HEAD, OPTIONS, PUT, POST, DELETE',
    headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  }));
  app.use(bodyParser());

  // register special controllers which should come before any jwt token check and be publicly accessible
  require('../controllers/public').init(app);
  require('../controllers/login').init(app);

  // serve the static files in the /client directory, use caching only in production (7 days)
  var sendOpts = config.app.env === 'production' ? {root: 'client', maxage: config.app.cacheTime} : {root: 'client'};
  app.use(function *(next) {
    // do not handle /api paths
    if (this.path.substr(0, 5).toLowerCase() === '/api/') {
      yield next;
      return;
    } else if (yield send(this, this.path, sendOpts)) {
      // file exists and request successfully served so do nothing
      return;
    } else if (this.path.indexOf('.') !== -1) {
      // file does not exist so do nothing and koa will return 404 by default
      // we treat any path with a dot '.' in it as a request for a file
      return;
    } else {
      // request is for a subdirectory so treat it as an angular route and serve index.html, letting angular handle the routing properly
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
