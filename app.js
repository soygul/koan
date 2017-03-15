'use strict';

/**
 * Entry point for KOAN app. Initiates database connection and starts listening for requests on configured port.
 */

var config = require('./server/config/config'),
    mongo = require('./server/config/mongo'),
    mongoSeed = require('./server/config/mongo-seed'),
    koaConfig = require('./server/config/koa'),
    ws = require('./server/config/ws'),
    Koa = require('koa'),
    app = new Koa();

module.exports = app;

/**
 * Initializes a new KOAN server.
 * @param overwriteDB Overwrite existing database with the seed data. Useful for testing environment.
 */
app.init = async function (overwriteDB) {
  // initialize mongodb and populate the database with seed data if empty
  await mongo.connect();
  await mongoSeed(overwriteDB);

  // koa config
  koaConfig(app);

  // create http and websocket servers and start listening for requests
  app.server = app.listen(config.app.port);
  ws.listen(app.server);
  if (config.app.env !== 'test') {
    console.log('KOAN listening on port ' + config.app.port);
  }
};

// auto init if this app is not being initialized by another module (i.e. using require('./app').init();)
if (!module.parent) {
  app.init().catch(function (err) {
    console.error(err);
    process.exit(1);
  });
}
