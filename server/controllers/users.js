'use strict';

/**
 * Users controller for user profile relation operations.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.post('/api/users', createUser));
};

/**
 * Creates a new user.
 */
function *createUser() {
  // todo: check user role === 'admin' when role system is ready
  // we need to validate user body with node-validator here not to save junk data in the database..
  var user = yield parse(this);

  // get the latest userId+1 as the new user id
  // this is exceptional to user creation as we want user ids to be sequential numbers and not standard mongo guids
  user._id = yield mongo.getNextSequence('userId');
  var results = yield mongo.users.insert(user);

  this.status = 201;
  this.body = {id: results[0]._id};
}