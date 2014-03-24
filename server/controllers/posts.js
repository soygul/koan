'use strict';

/**
 * Posts controller for serving user posts.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/posts', listPosts));
  app.use(route.post('/api/posts', createPost));
  app.use(route.post('/posts/:id/comments', createComment));
};

function *listPosts() {
  this.body = yield mongo.posts.find(
      {},
      {comments: {$slice: -15 /* only get last x many comments for each post */}},
      {limit: 15, sort: {_id: -1}} /* only get last 15 posts */).toArray();
}

function *createPost() {
  // todo: validate post body
  var post = yield parse(this);
  post.from = this.user;
  post.createdTime = new Date();
  var results = yield mongo.posts.insert(post);
  this.status = 201;
  this.body = results[0]._id.toString();
}

function *createComment(id) {
  this.status = 501; // not implemented
}