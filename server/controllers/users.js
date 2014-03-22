'use strict';

/**
 * Users controller for users related functionality.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
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