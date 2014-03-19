'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('./server/config/mongo');

/**
 * Register koa routes.
 */
exports.init = function (app) {
  app.get(route.get('/users/:id/picture', getPicture));
  app.use(route.get('/api/users', list));
  app.use(route.get('/api/users/post/:id', show));
  app.use(route.post('/api/users/post', create));
};

var users = [{id: 1, name: 'John Doe'}];

function *list() {
  this.body = users;
}

function *show(id) {
  var user = users[id];
  if (!user) {
    this.throw(404, 'invalid user id');
  }
  this.body = user;
}

function *create() {
  var user = yield parse(this);
  var id = users.push(user) - 1;
  user.created_at = new Date();
  user.id = id;
  this.redirect('/');
}

function *getPicture(id) {
  id = parseInt(id);
  var user = yield mongo.findOne({_id: id}, {photo: 1});
  if (user) {
    var img = new Buffer(user.photo, 'base64');
    this.set('Content-Type', 'image/jpeg');
    this.body = img;
  }
}