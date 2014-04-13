'use strict';

/**
 * Messages controller for broadcasting chat messages to clients.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    ws = require('../config/ws'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.post('/api/messages', createMessage));
};

function *createMessage() {
  var message = yield parse(this);
  message.from = this.user;
  message.createdTime = new Date();

  this.status = 201;

  // now notify everyone about this new message
  ws.notify('messages.created', message);
}