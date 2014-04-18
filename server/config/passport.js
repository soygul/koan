'use strict';

/**
 * Passport.js implementation suitable for use with Koa.
 */

var passport = module.exports = require('koa-passport'),
    route = require('koa-route'),
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google-oauth').Strategy,
    config = require('./config');

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

passport.use(new FacebookStrategy({
      clientID: config.passport.facebook.clientID,
      clientSecret: config.passport.facebook.clientSecret,
      callbackURL: config.passport.facebook.callbackURL,
      enableProof: false
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
));

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

passport.use(new GoogleStrategy({
      returnURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback',
      realm: 'http://localhost:' + (process.env.PORT || 3000)
    },
    function (identifier, profile, done) {
      // retrieve user ...
      done(null, user);
    }
));