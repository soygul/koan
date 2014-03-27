'use strict';

/* Controllers */

angular.module('koan.controllers', [])

    .controller('layout', function ($rootScope, $window) {
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
              $scope.posts.unshift({
                id: postId,
                from: user,
                message: $scope.postBox.message,
                createdTime: new Date()
              });

              // clear the post box and enable it
              $scope.postBox.message = '';
              $scope.postBox.disabled = false;
            })
            .error(function (data, status) {
              // don't clear the post box but enable it so the user can re-try
              $scope.postBox.disabled = false;
            });
      };

      $scope.createComment = function ($event, post) {
        // don't let the user type in blank lines or submit empty/whitespace only comment, or type in something when post is being created
        if (!post.commentBox.message.length || post.commentBox.disabled) {
          $event.preventDefault();
          return;
        }

        // submit the message in the comment box only if user hits 'Enter (keycode 13)'
        if ($event.keyCode !== 13) {
          return;
        }

        // disable the post box and push the new post to server
        post.commentBox.disabled = true;
        api.posts.comments.create(post.id, {message: post.commentBox.message})
            .success(function (commentId) {
              post.comments.data.push({
                id: commentId,
                from: user,
                message: post.commentBox.message,
                createdTime: new Date()
              });

              // clear the comment field and enable it
              post.commentBox.message = '';
              post.commentBox.disabled = false;
            })
            .error(function (data, status) {
              // don't clear the post box but enable it so the user can re-try
              post.commentBox.disabled = false;
            });

        // prevent default 'Enter' button behavior (create new line) as we want 'Enter' button to do submission
        $event.preventDefault();
      };
    });