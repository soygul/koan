'use strict';

/**
 * Publicly accessible api endpoint.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/users/:id/picture', getPicture));
};

function *getPicture(id) {
  id = parseInt(id);
  var user = yield mongo.users.findOne({_id: id}, {picture: 1});
  if (user) {
    var img = new Buffer(user.picture, 'base64');
    this.set('Content-Type', 'image/jpeg');
    this.body = img;
  }
}