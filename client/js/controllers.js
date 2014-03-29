'use strict';

/* Controllers */

angular.module('koan.controllers', [])

    .controller('layout', function ($rootScope, $window, api) {
      /**
       * layout controller is always invoked once, regardless of the given route, to prepare the UI layout variables (like user profile image, display name, online status, etc.)
       */
      var layout = $rootScope.layout = $rootScope.layout || {
        active: {},
        user: JSON.parse($window.sessionStorage.user || $window.localStorage.user),
        logout: function () {
          delete $window.sessionStorage.token;
          delete $window.sessionStorage.user;
          delete $window.localStorage.token;
          delete $window.localStorage.user;
          $window.location.replace('/login.html');
        }
      };

      // declare websocket event listeners for backend api
      api.connected.subscribe(function () {
        layout.onlineIndicatorStyle = {'background-color': 'green'};
      });

      api.disconnected.subscribe(function () {
        layout.onlineIndicatorStyle = {'background-color': 'lightgrey'};
      });
    })

    .controller('profile', function ($scope, $http, $window) {
      /**
       * profile controller gives the user the means to view/edit their public profile info
       */
    })

    .controller('home', function ($scope, api) {
      /**
       * home controller simply lists all the posts from everyone on the front page
       */
      var user = $scope.layout.user;
      $scope.postBox = {message: null, disabled: false};

      // retrieve posts from server
      api.posts.list().success(function (posts) {
        posts.forEach(function (post) {
          post.commentBox = {message: '', disabled: false};
          post.comments = post.comments || [];
        });
        $scope.posts = posts;
      });

      // add post/comment creation functions to scope
      $scope.createPost = function ($event) {
        // don't let the user type in blank lines or submit empty/whitespace only post, or type in something when post is being created
        if (!$scope.postBox.message.length || $scope.postBox.disabled) {
          $event.preventDefault();
          return;
        }

        // disable the post box and push the new post to server
        $scope.postBox.disabled = true;
        api.posts.create({message: $scope.postBox.message})
            .success(function (postId) {
              // only add the post if we don't have it already in the posts list to avoid dupes
              if (!_.some($scope.posts, function (p) {
                return p.id === postId;
              })) {
                $scope.posts.unshift({
                  id: postId,
                  from: user,
                  message: $scope.postBox.message,
                  createdTime: new Date(),
                  comments: [],
                  commentBox: {message: '', disabled: false}
                });
              }

              // clear the post box and enable it
              $scope.postBox.message = '';
              $scope.postBox.disabled = false;
            })
            .error(function () {
              // don't clear the post box but enable it so the user can re-try
              $scope.postBox.disabled = false;
            });
      };

      $scope.createComment = function ($event, post) {
        // submit the message in the comment box only if user hits 'Enter (keycode 13)'
        if ($event.keyCode !== 13) {
          return;
        }

        // don't let the user type in blank lines or submit empty/whitespace only comment, or type in something when post is being created
        if (!post.commentBox.message.length || post.commentBox.disabled) {
          $event.preventDefault();
          return;
        }

        // disable the post box and push the new post to server
        post.commentBox.disabled = true;
        api.posts.comments.create(post.id, {message: post.commentBox.message})
            .success(function (commentId) {
              post.comments.push({
                id: commentId,
                from: user,
                message: post.commentBox.message,
                createdTime: new Date()
              });

              // clear the comment field and enable it
              post.commentBox.message = '';
              post.commentBox.disabled = false;
            })
            .error(function () {
              // don't clear the post box but enable it so the user can re-try
              post.commentBox.disabled = false;
            });

        // prevent default 'Enter' button behavior (create new line) as we want 'Enter' button to do submission
        $event.preventDefault();
      };

      // subscribe to websocket events to receive new posts, comments, etc.
      api.posts.created.subscribe(function (post) {
        // only add the post if we don't have it already in the posts list to avoid dupes
        if (!_.some($scope.posts, function (p) {
          return p.id === post.id;
        })) {
          post.comments = [];
          post.commentBox = {message: '', disabled: false};
          $scope.posts.unshift(post);
        }
      });

      api.posts.comments.created.subscribe(function (comment) {
        var post = _.find($scope.posts, function (post) {
          return post.id === comment.postId;
        });

        // add the comment to the view only if we have the post in the view but not the comment itself (i.e. comment was not created via this browser)
        if (post && !_.some(post.comments.data, function (c) {
          return c.id === comment.id;
        })) {
          post.comments.data.push(comment);
        }
      });
    });