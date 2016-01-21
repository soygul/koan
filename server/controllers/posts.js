'use strict';

/**
 * Posts controller for serving user posts.
 */

var route = require('koa-route'),
    mongo = require('../config/mongo'),
    ws = require('../config/ws'),
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
  var posts = yield mongo.posts.find(
      {},
      {comments: {$slice: -15 /* only get last x many comments for each post */}},
      {limit: 15, sort: {_id: -1}} /* only get last 15 posts by last updated */).toArray();

  posts.forEach(function (post) {
    post.id = post._id;
    delete post._id;
  });

  this.body = posts;
}

/**
 * Saves a new post in the database after proper validations.
 */
function *createPost() {
  // it is best to validate post body with something like node-validator here, before saving it in the database..
  var post = this.request.body;
  post.from = this.state.user; // user info is stored in 'this.state.user' field after successful login, as suggested by Koa docs: http://koajs.com/#ctx-state
  post.createdTime = new Date();
  var results = yield mongo.posts.insertOne(post);

  this.status = 201;
  this.body = {id: results.ops[0]._id};

  // now notify everyone about this new post
  post.id = post._id;
  delete post._id;
  ws.notify('posts.created', post);
}

/**
 * Appends a new comment to a given post.
 * @param postId - Post ID.
 */
function *createComment(postId) {
  postId = new ObjectID(postId);
  var comment = this.request.body;
  var commentId = new ObjectID();

  // update post document with the new comment
  comment = {_id: commentId, from: this.state.user, createdTime: new Date(), message: comment.message};
  var result = yield mongo.posts.update(
      {_id: postId},
      {$push: {comments: comment}}
  );

  this.status = 201;
  this.body = {id: commentId};

  // now notify everyone about this new comment
  comment.id = comment._id;
  comment.postId = postId;
  delete comment._id;
  ws.notify('posts.comments.created', comment);
}