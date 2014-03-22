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

    .controller('home', function ($scope) {
      /**
       * home controller simply lists all the posts from everyone on the front page
       */
      var user = $scope.layout.user,
          now = new Date();
      $scope.posts = [
        {
          id: 1,
          from: { id: 2, name: 'Chuck Norris', picture: 'api/users/2/picture' },
          message: 'Hi there! Just wanted to say "Hello world!',
          createdTime: now.subtractHours(28)
        },
        {
          id: 2,
          from: { id: 1, name: 'Teoman Soygul', picture: 'api/users/1/picture' },
          message: '"Computers are useless. They can only give you answers." Pablo Picasso',
          createdTime: now.subtractHours(49),
          updatedTime: now.subtractHours(24)
        },
        {
          id: 3,
          from: { id: 1, name: 'Teoman Soygul', picture: 'api/users/1/picture' },
          message: 'Hi guys, I\'m traveling to Bolivia for the weekend!',
          createdTime: now.subtractHours(97),
          updatedTime: now.subtractHours(24),
          comments: [
            {
              id: 1,
              from: { id: 2, name: 'Chuck Norris', picture: 'api/users/2/picture' },
              createdTime: now.subtractHours(26),
              message: 'Ola! This is a nice idea!'
            },
            {
              id: 2,
              from: { id: 3, name: 'Albert Einstein' },
              createdTime: now.subtractHours(25),
              message: 'Don\'t forget to bring back an iguana:)'
            },
            {
              id: 3,
              from: { id: 1, name: 'Teoman Soygul', picture: 'api/users/1/picture' },
              createdTime: now.subtractHours(24),
              message: 'Thanks guys, I\'ll see you when I get back.'
            }
          ]
        }
      ];
      $scope.postBox = { message: null, disabled: false };
      $scope.createPost = function ($event) {
        // don't let the user type in blank lines or submit empty/whitespace only comment
        if (!$scope.postBox.message.length) {
          $event.preventDefault();
          return;
        }

        // disable the post box and push the post to server
        $scope.posts.disabled = true;
        var post = {
          from: user,
          message: $scope.postBox.message,
          createdTime: new Date()
        };

        $scope.posts.unshift(post);
      };
    })

    .controller('profile', function ($scope, $http, $window) {
      /**
       * profile controller gives the user the means to view/edit their public profile info
       */
      $scope.callRestricted = function () {
        $http({url: '/api/users', method: 'GET'})
            .success(function (data, status, headers, config) {
              $scope.message = data;
            })
            .error(function (data, status, headers, config) {
              alert(data);
            });
      };
    });