'use strict';

/**
 * Password based signin and OAuth signin functions.
 */

var qs = require('querystring'),
    route = require('koa-route'),
    parse = require('co-body'),
    jwt = require('koa-jwt'),
    request = require('co-request'),
    config = require('../config/config'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.post('/signin', signin));
  app.use(route.get('/signin/facebook', facebooksignin));
  app.use(route.get('/signin/facebook/callback', facebookCallback));
  app.use(route.get('/signin/google', googlesignin));
  app.use(route.get('/signin/google/callback', googleCallback));
};

/**
 * Retrieves the user credentials and returns a JSON Web Token along with user profile info in JSON format.
 */
function *signin() {
  var credentials = yield parse(this);
  var user = yield mongo.users.findOne({email: credentials.email}, {email: 1, name: 1, password: 1});

  if (!user) {
    this.throw(401, 'Incorrect e-mail address.');
  } else if (user.password !== credentials.password) {
    this.throw(401, 'Incorrect password.');
  } else {
    user.id = user._id;
    delete user._id;
    delete user.password;
    user.picture = 'api/users/' + user.id + '/picture';
  }

  // sign and send the token along with the user info
  var token = jwt.sign(user, config.app.secret, {expiresInMinutes: 90 * 24 * 60 /* 90 days */});
  this.body = {token: token, user: user};
}

/**
 * Facebook OAuth 2.0 signin endpoint.
 */
function *facebooksignin() {
  this.redirect(
          'https://www.facebook.com/dialog/oauth?client_id=' + config.oauth.facebook.clientId +
          '&redirect_uri=' + config.oauth.facebook.callbackUrl + '&response_type=code&scope=email');
}

/**
 * Facebook OAuth 2.0 callback endpoint.
 */
function *facebookCallback() {
  if (this.query.error) {
    this.redirect('/signin');
    return;
  }

  // get an access token from facebook in exchange for oauth code
  var tokenResponse = yield request.get(
          'https://graph.facebook.com/oauth/access_token?client_id=' + config.oauth.facebook.clientId +
          '&redirect_uri=' + config.oauth.facebook.callbackUrl +
          '&client_secret=' + config.oauth.facebook.clientSecret +
          '&code=' + this.query.code);
  var token = qs.parse(tokenResponse.body);
  if (!token.access_token) {
    this.redirect('/signin');
    return;
  }

  // get user profile (including email address) from facebook and save user data in our database if necessary
  var profileResponse = yield request.get('https://graph.facebook.com/me?fields=name,email,picture&access_token=' + token.access_token);
  var profile = JSON.parse(profileResponse.body);
  var user = yield mongo.users.findOne({email: profile.email}, {email: 1, name: 1});
  if (!user) {
    user = {
      _id: (yield mongo.getNextSequence('userId')),
      email: profile.email,
      name: profile.name,
      picture: (yield request.get(profile.picture.data.url, {encoding: 'base64'})).body
    };
    yield mongo.users.insert(user);
  }

  // redirect the user to index page along with user profile object as query string
  user.id = user._id;
  delete user._id;
  user.picture = 'api/users/' + user.id + '/picture';
  jwt.sign(user, config.app.secret, {expiresInMinutes: 90 * 24 * 60 /* 90 days */});
  this.redirect('/?user=' + encodeURIComponent(JSON.stringify({token: token, user: user})));
}

/**
 * Google OAuth 2.0 signin endpoint.
 */
function *googlesignin() {
  this.redirect(
          'https://accounts.google.com/o/oauth2/auth?client_id=' + config.oauth.google.clientId +
          '&redirect_uri=' + config.oauth.google.callbackUrl + '&response_type=code&scope=profile%20email');
}

function *googleCallback() {
  if (this.query.error) {
    this.redirect('/signin');
    return;
  }

  // get an access token from google in exchange for oauth code
  var tokenResponse = yield request.post('https://accounts.google.com/o/oauth2/token', {form: {
    code: this.query.code,
    client_id: config.oauth.google.clientId,
    client_secret: config.oauth.google.clientSecret,
    redirect_uri: config.oauth.google.callbackUrl,
    grant_type: 'authorization_code'
  }});
  var token = JSON.parse(tokenResponse.body);
  if (!token.access_token) {
    this.redirect('/signin');
    return;
  }

  // get user profile (including email address) from facebook and save user data in our database if necessary
  var profileResponse = yield request.get('https://www.googleapis.com/plus/v1/people/me?access_token=' + token.access_token);
  var profile = JSON.parse(profileResponse.body);
  var user = yield mongo.users.findOne({email: profile.emails[0].value}, {email: 1, name: 1});
  if (!user) {
    user = {
      _id: (yield mongo.getNextSequence('userId')),
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: (yield request.get(profile.image.url, {encoding: 'base64'})).body
    };
    yield mongo.users.insert(user);
  }

  // redirect the user to index page along with user profile object as query string
  user.id = user._id;
  delete user._id;
  user.picture = 'api/users/' + user.id + '/picture';
  jwt.sign(user, config.app.secret, {expiresInMinutes: 90 * 24 * 60 /* 90 days */});
  this.redirect('/?user=' + encodeURIComponent(JSON.stringify({token: token, user: user})));
}
