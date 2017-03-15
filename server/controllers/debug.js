'use strict';

/**
 * Remote debugging tools controller for the API. Remove this controller in production if you don't want random people dropping your database!
 */

var route = require('koa-route'),
    config = require('../config/config'),
    mongoSeed = require('../config/mongo-seed');

// register koa routes
exports.init = function (app) {
  app.use(route.post('/api/debug/clearDatabase', clearDatabase));
};

async function clearDatabase(ctx) {
  // todo: check user role === 'admin' when role system is ready
  await mongoSeed(true);
  ctx.status = 200;
}