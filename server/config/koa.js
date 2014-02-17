'use strict';

var logger = require('koa-logger'),
    route = require('koa-route'),
    render = require('views'),
    parse = require('co-body');

module.exports = function (app) {
  var env = process.env.NODE_ENV || 'development';

  // middleware configuration
  app.keys = ['some secret hurr'];
  if (env !== 'test') {
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