'use strict';

var config = require('./config'),
    logger = require('koa-logger'),
    route = require('koa-route'),
    session = require('koa-session'),
    render = require('co-views'),
    parse = require('co-body');

module.exports = function (app) {
  // middleware configuration
  app.keys = ['some secret hurr'];
  app.use(session());
  if (config.app.env !== 'test') {
    app.use(logger());
  }

  // routes
  app.use(route.get('/', list));
  app.use(route.get('/post/new', add));
  app.use(route.get('/post/:id', show));
  app.use(route.post('/post', create));

  // route definitions
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
};