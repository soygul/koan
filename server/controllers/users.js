'use strict';

var app = require('../../app'),
    route = require('koa-route'),
    parse = require('co-body');

/**
 * Registers Express app routes.
 */
exports.init = function (baseUri) {
  app.get(baseUri + '/users/:id?', get);
  app.get(baseUri + '/users/:id/picture', getPicture);
  app.post(baseUri + '/users', post);
  app.post(baseUri + '/users/:id/friend-requests', createOrAcceptFriendRequest);
  app.delete(baseUri + '/users/:id/friend-requests', rejectFriendRequest);
};