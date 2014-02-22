'use strict';

var config = require('./server/config/config'),
    mongo = require('./server/config/mongo'),
    co = require('co'),
    koa = require('koa'),
    app = module.exports = koa();

co(function *() {
  // koa config
  require('./server/config/koa')(app);

  // initialize mongo
  yield mongo.connect();

  if (!module.parent) {
    app.listen(config.app.port);
    console.log('listening on port ' + config.app.port);
  }
})();