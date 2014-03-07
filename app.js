'use strict';

var config = require('./server/config/config'),
    mongo = require('./server/config/mongo'),
    co = require('co'),
    koa = require('koa'),
    app = module.exports = koa();

co(function *() {
  // initialize mongo
  yield mongo.connect();

  // koa config
  require('./server/config/koa')(app);

  if (!module.parent) {
    app.listen(config.app.port);
    console.log('KOAN listening on port ' + config.app.port);
  }
})();