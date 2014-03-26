'use strict';

/**
 * Posts controller for serving user posts.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/posts', listPosts));
  app.use(route.post('/api/posts', createPost));
  app.use(route.post('/api/posts/:postId/comments', createComment));
};

/**
 * Lists last 15 posts with latest 15 comments in them.
 */
function *listPosts() {
  this.body = yield mongo.posts.find(
      {},
      {comments: {$slice: -15 /* only get last x many comments for each post */}},
      {limit: 15, sort: {_id: -1}} /* only get last 15 posts */).toArray();
}

/**
 * Saves a new post in the database after proper validations.
 */
function *createPost() {
  var post = yield parse(this);
  // todo: validate post body here..
  post.from = this.user;
  post.createdTime = new Date();
  var results = yield mongo.posts.insert(post);
  this.status = 201;
  this.body = results[0]._id.toString();
}

/**
 * Appends a new comment to a given post.
 * @param id Post ID.
 */
function *createComment(postId) {
  postId = new ObjectID(postId);
  var comment = yield parse(this);
  this.status = 501; // not implemented
}