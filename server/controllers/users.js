'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    render = require('../config/render');

/**
 * Register koa routes.
 */
exports.init = function (app) {
  app.use(route.get('/api/', list));
  app.use(route.get('/api/post/new', add));
  app.use(route.get('/api/post/:id', show));
  app.use(route.post('/api/post', create));
};

var posts = [];

function *list() {
  this.body = yield render('list', { posts: posts });
}

function *add() {
  this.body = yield render('new');
}

function *show(id) {
  var post = posts[id];
  if (!post) {
    this.throw(404, 'invalid post id');
  }
  this.body = yield render('show', { post: post });
}

function *create() {
  var post = yield parse(this);
  var id = posts.push(post) - 1;
  post.created_at = new Date();
  post.id = id;
  this.redirect('/');
}