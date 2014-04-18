'use strict';

/**
 * Passport.js implementation suitable for use with Koa.
 */

var passport = module.exports = require('koa-passport'),
    route = require('koa-route'),
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google-oauth').Strategy,
    config = require('./config'),
    mongo = require('./mongo');

passport.routes = function (app) {
  if (!config.passport) {
    return;
  }

  if (config.passport.facebook) {
    app.use(route.get('/login/facebook', function *() {
      passport.authenticate('facebook', {scope: ['email']});
    }));

    app.use(route.get('/login/facebook/callback', function *() {
      passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
      });
    }));
  }
};

if (!config.passport) {
  return;
}

// todo: these two are redundant
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
// todo: these two are redundant

if (config.passport.facebook) {
  passport.use(new FacebookStrategy({
        clientID: config.passport.facebook.clientID,
        clientSecret: config.passport.facebook.clientSecret,
        callbackURL: config.passport.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'name', 'emails', 'photos'],
        enableProof: false
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
  ));
}

if (config.passport.twitter) {
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
}

if (config.passport.google) {
  passport.use(new GoogleStrategy({
        returnURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback',
        realm: 'http://localhost:' + (process.env.PORT || 3000)
      },
      function (identifier, profile, done) {
        // retrieve user ...
        done(null, user);
      }
  ));
}