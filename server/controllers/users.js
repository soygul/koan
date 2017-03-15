'use strict';

/**
 * Users controller for user profile relation operations.
 */

var route = require('koa-route'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.post('/api/users', createUser));
};

/**
 * Creates a new user.
 */
async function createUser(ctx) {
  // todo: check user role === 'admin' when role system is ready
  // we need to validate user body with node-validator here not to save junk data in the database..
  var user = ctx.request.body;

  // get the latest userId+1 as the new user id
  // this is exceptional to user creation as we want user ids to be sequential numbers and not standard mongo guids
  user._id = await mongo.getNextSequence('userId');
  var results = await mongo.users.insertOne(user);
  
  ctx.status = 201;
  ctx.body = {id: results.ops[0]._id};
}