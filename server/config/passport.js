'use strict';

// todo: passport auth needs more work here.. currently it is just a stub.

var passport = module.exports = require('koa-passport'),
    route = require('koa-route');

if (!config.passport) {
  return;
}

passport.routes = function (app) {
  app.use(route.get('/login/facebook', function *() {
    passport.authenticate('facebook');
  }));

  app.use(route.get('/login/facebook/callback', function *() {
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    });
  }));
};

var user = {
  id: 123,
  email: 'john@doe.com',
  name: 'John Doe'
};

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, user);
});

var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
      clientID: 'your-client-id',
      clientSecret: 'your-secret',
      callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
    },
    function (token, tokenSecret, profile, done) {
      // retrieve user ...
      done(null, user);
    }
));

var TwitterStrategy = require('passport-twitter').Strategy;
passport.use(new TwitterStrategy({
      consumerKey: 'your-consumer-key',
      consumerSecret: 'your-secret',
      callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/twitter/callback'
    },
    function (token, tokenSecret, profile, done) {
      // retrieve user ...
      done(null, user);
    }
));

/*var GoogleStrategy = require('passport-google-oauth').Strategy;
passport.use(new GoogleStrategy({
      returnURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback',
      realm: 'http://localhost:' + (process.env.PORT || 3000)
    },
    function (identifier, profile, done) {
      // retrieve user ...
      done(null, user);
    }
));*/
