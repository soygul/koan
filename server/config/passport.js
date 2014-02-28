'use strict';

var passport = module.exports = require('koa-passport');

var user = { id: 1, username: 'test' };

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, user);
});

var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function (username, password, done) {
  // retrieve user ...
  if (username === 'test' && password === 'test') {
    done(null, user);
  } else {
    done(null, false);
  }
}));

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