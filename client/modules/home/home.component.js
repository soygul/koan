'use strict';

/**
 * Home component simply lists all the posts from everyone on the front page.
 */

angular.module('koan.home').component('home', {
  templateUrl: 'modules/home/home.template.html',
  controller: function ($rootScope, api) {
    var ctrl = this;
    var user = ctrl.user = $rootScope.common.user;
    ctrl.postBox = {message: null, disabled: false};

    // retrieve posts from server
    api.posts.list().success(function (posts) {
      posts.forEach(function (post) {
        post.commentBox = {message: '', disabled: false};
        post.comments = post.comments || [];
      });
      ctrl.posts = posts;
    });

    // add post/comment creation functions to scope
    ctrl.createPost = function ($event) {
      // don't let the user type in blank lines or submit empty/whitespace only post, or type in something when post is being created
      if (!ctrl.postBox.message.length || ctrl.postBox.disabled) {
        $event.preventDefault();
        return;
      }

      // disable the post box and push the new post to server
      ctrl.postBox.disabled = true;
      api.posts.create({message: ctrl.postBox.message})
          .success(function (post) {
            // only add the post if we don't have it already in the posts list to avoid dupes
            if (!_.some(ctrl.posts, function (p) {
                  return p.id === post.id;
                })) {
              ctrl.posts.unshift({
                id: post.id,
                from: user,
                message: ctrl.postBox.message,
                createdTime: new Date(),
                comments: [],
                commentBox: {message: '', disabled: false}
              });
            }

            // clear the post box and enable it
            ctrl.postBox.message = '';
            ctrl.postBox.disabled = false;
          })
          .error(function () {
            // don't clear the post box but enable it so the user can re-try
            ctrl.postBox.disabled = false;
          });
    };

    ctrl.createComment = function ($event, post) {
      // submit the message in the comment box only if user hits 'Enter (keycode 13)'
      if ($event.keyCode !== 13) {
        return;
      }

      // don't let the user type in blank lines or submit empty/whitespace only comment, or type in something when comment is being created
      if (!post.commentBox.message.length || post.commentBox.disabled) {
        $event.preventDefault();
        return;
      }

      // disable the comment box and push the new comment to server
      post.commentBox.disabled = true;
      api.posts.comments.create(post.id, {message: post.commentBox.message})
          .success(function (comment) {
            // only add the comment if we don't have it already in the post's comments list to avoid dupes
            if (!_.some(post.comments, function (c) {
                  return c.id === comment.id;
                })) {
              post.comments.push({
                id: comment.id,
                from: user,
                message: post.commentBox.message,
                createdTime: new Date()
              });
            }

            // clear the comment field and enable it
            post.commentBox.message = '';
            post.commentBox.disabled = false;
          })
          .error(function () {
            // don't clear the comment box but enable it so the user can re-try
            post.commentBox.disabled = false;
          });

      // prevent default 'Enter' button behavior (create new line) as we want 'Enter' button to do submission
      $event.preventDefault();
    };

    // subscribe to websocket events to receive new posts, comments, etc.
    api.posts.created.subscribe(ctrl, function (post) {
      // only add the post if we don't have it already in the posts list to avoid dupes
      if (!_.some(ctrl.posts, function (p) {
            return p.id === post.id;
          })) {
        post.comments = [];
        post.commentBox = {message: '', disabled: false};
        ctrl.posts.unshift(post);
      }
    });

    api.posts.comments.created.subscribe(ctrl, function (comment) {
      var post = _.find(ctrl.posts, function (post) {
        return post.id === comment.postId;
      });

      // only add the comment if we don't have it already in the post's comments list to avoid dupes
      if (post && !_.some(post.comments, function (c) {
            return c.id === comment.id;
          })) {
        post.comments.push(comment);
      }
    });

  }
});