'use strict';

/**
 * Publicly accessible API endpoints. This is useful for special cases like user profile images, etc.
 */

var route = require('koa-route'),
    config = require('../config/config'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/users/:id/picture', getPicture));
};

/**
 * Serves user profile picture in jpeg format.
 * @param id - User ID.
 */
async function getPicture(ctx, id) {
  id = parseInt(id);
  var user = await mongo.users.findOne({_id: id}, {picture: 1});
  if (user) {
    var img = new Buffer(user.picture, 'base64');
    ctx.set('Content-Type', 'image/jpeg');
    if (config.app.cacheTime) {
      ctx.set('Cache-Control', 'max-age=' + (config.app.cacheTime / 1000));
    }
    ctx.body = img;
  }
}