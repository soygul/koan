'use strict';

var config = require('./server/config/config'),
    koa = require('koa'),
    app = module.exports = koa();

// koa config
require('./server/config/koa')(app);

if (!module.parent) {
  app.listen(config.app.port);
  console.log('listening on port ' + config.app.port);
}