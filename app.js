'use strict';

var config = require('./server/config/config'),
    mongo = require('./server/config/mongo'),
    popdb = require('./server/config/popdb'),
    co = require('co'),
    koa = require('koa'),
    app = module.exports = koa();

/**
 * Entry point for KOAN app. Initiates database connection and starts listening for requests on configured port.
 */
co(function *() {
  // initialize mongodb and populate the database with seed data if empty
  yield mongo.connect();
  yield popdb(true);

  // koa config
  require('./server/config/koa')(app);

  if (!module.parent) {
    app.listen(config.app.port);
    console.log('KOAN listening on port ' + config.app.port);
  }
})();