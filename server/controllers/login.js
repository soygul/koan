'use strict';

/**
 * Password based login and OAuth login functions.
 */

var querystring = require('querystring'),
    route = require('koa-route'),
    parse = require('co-body'),
    jwt = require('koa-jwt'),
    request = require('co-request'),
    config = require('../config/config'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.post('/login', login));
  app.use(route.get('/login/facebook', facebookLogin));
  app.use(route.get('/login/facebook/callback', facebookCallback));
};

/**
 * Retrieves user credentials from an HTML form post (x-www-form-urlencoded) and returns a JSON Web Token along with user profile info in JSON format.
 */
function *login() {
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
 * Facebook OAuth 2.0 login endpoint.
 */
function *facebookLogin() {
  // todo: implement a stateless nonce algorithm form &state=nonce query param
  this.redirect(
          'https://www.facebook.com/dialog/oauth?client_id=' + config.oauth.facebook.clientId +
          '&redirect_uri=' + config.oauth.facebook.callbackUrl + '&response_type=code&scope=email&state=nonce');
}

/**
 * Facebook OAuth 2.0 callback endpoint.
 */
function *facebookCallback() {
  if (this.query.error || this.query.state !== 'nonce') {
    this.redirect('/login');
    return;
  }

  // get an access token from facebook in exchange for oauth code
  var tokenResponse = yield request.get(
          'https://graph.facebook.com/oauth/access_token?client_id=' + config.oauth.facebook.clientId +
          '&redirect_uri=' + config.oauth.facebook.callbackUrl +
          '&client_secret=' + config.oauth.facebook.clientSecret +
          '&code=' + this.query.code);
  var token = querystring.parse(tokenResponse.body);
  if (!token.access_token) {
    this.redirect('/login');
    return;
  }

  // get user profile (including email address) from facebook and save user data in our database if necessary
  var profileResponse = yield request.get('https://graph.facebook.com/me?fields=name,email,picture.type(large)&access_token=' + token.access_token);
  var profile = JSON.parse(profileResponse.body);
  var user = yield mongo.users.findOne({email: profile.email}, {email: 1, name: 1});
  if (!user) {
    user = {
      _id: (yield mongo.getNextSequence('userId')),
      email: profile.email,
      name: profile.name,
      picture: (yield request.get(profile.picture.data.url, {encoding: 'base64'})).body
    };
    var results = yield mongo.users.insert(user);
  }

  // redirect the user to password selection box (for the first timers) or the index page along with user profile object as query string
  user.id = user._id;
  delete user._id;
  user.picture = 'api/users/' + user.id + '/picture';
  var token = jwt.sign(user, config.app.secret, {expiresInMinutes: 90 * 24 * 60 /* 90 days */});
  this.redirect('/?user=' + encodeURIComponent(JSON.stringify({token: token, user: user})));
}

function handleOAuthCallback() {

}