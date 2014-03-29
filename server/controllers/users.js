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
  var user = yield parse(this);

  // get the latest userId+1 as the new user id
  user._id = yield mongo.getNextSequence('userId');
  var results = yield mongo.users.insert(user);

  this.status = 201;
  this.body = results[0]._id.toString();
}