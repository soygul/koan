'use strict';

/**
 * Password based login and OAuth login functions.
 */

var qs = require('querystring'),
    route = require('koa-route'),
    jwt = require('jsonwebtoken'),
    request = require('co-request'),
    config = require('../config/config'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
  app.use(route.post('/login', login));
  app.use(route.get('/login/facebook', facebookLogin));
  app.use(route.get('/login/facebook/callback', facebookCallback));
  app.use(route.get('/login/google', googleLogin));
  app.use(route.get('/login/google/callback', googleCallback));
};

/**
 * Receives the user credentials and returns a JSON Web Token along with user profile info in JSON format.
 */
async function login(ctx) {
  var credentials = ctx.request.body;
  var user = await mongo.users.findOne({email: credentials.email}, {email: 1, name: 1, password: 1});

  if (!user) {
    ctx.throw(401, 'Incorrect e-mail address.');
  } else if (user.password !== credentials.password) {
    ctx.throw(401, 'Incorrect password.');
  } else {
    user.id = user._id;
    delete user._id;
    delete user.password;
    user.picture = '/api/users/' + user.id + '/picture';
  }

  // sign and send the token along with the user info
  var token = jwt.sign(user, config.app.secret);
  ctx.body = {token: token, user: user};
}

/**
 * Facebook OAuth 2.0 login endpoint.
 */
function facebookLogin(ctx) {
  ctx.redirect(
          'https://www.facebook.com/dialog/oauth?client_id=' + config.oauth.facebook.clientId +
          '&redirect_uri=' + config.oauth.facebook.callbackUrl + '&response_type=code&scope=email');
}

/**
 * Facebook OAuth 2.0 callback endpoint.
 */
async function facebookCallback(ctx) {
  if (ctx.query.error) {
    ctx.redirect('/login');
    return;
  }

  // get an access token from facebook in exchange for oauth code
  var tokenResponse = await request.get(
          'https://graph.facebook.com/oauth/access_token?client_id=' + config.oauth.facebook.clientId +
          '&redirect_uri=' + config.oauth.facebook.callbackUrl +
          '&client_secret=' + config.oauth.facebook.clientSecret +
          '&code=' + ctx.query.code);
  var token = JSON.parse(tokenResponse.body);
  if (!token.access_token) {
    ctx.redirect('/login');
    return;
  }

  // get user profile (including email address) from facebook and save user data in our database if necessary
  var profileResponse = await request.get('https://graph.facebook.com/me?fields=name,email,picture&access_token=' + token.access_token);
  var profile = JSON.parse(profileResponse.body);
  var user = await mongo.users.findOne({email: profile.email}, {email: 1, name: 1});
  if (!user) {
    user = {
      _id: (await mongo.getNextSequence('userId')),
      email: profile.email,
      name: profile.name,
      picture: (await request.get(profile.picture.data.url, {encoding: 'base64'})).body
    };
    var results = await mongo.users.insert(user);
  }

  // redirect the user to index page along with user profile object as query string
  user.id = user._id;
  delete user._id;
  user.picture = '/api/users/' + user.id + '/picture';
  var token = jwt.sign(user, config.app.secret);
  ctx.redirect('/?user=' + encodeURIComponent(JSON.stringify({token: token, user: user})));
}

/**
 * Google OAuth 2.0 login endpoint.
 */
function googleLogin(ctx) {
  ctx.redirect(
          'https://accounts.google.com/o/oauth2/auth?client_id=' + config.oauth.google.clientId +
          '&redirect_uri=' + config.oauth.google.callbackUrl + '&response_type=code&scope=profile%20email');
}

async function googleCallback(ctx) {
  if (ctx.query.error) {
    ctx.redirect('/login');
    return;
  }

  // get an access token from google in exchange for oauth code
  var tokenResponse = await request.post('https://accounts.google.com/o/oauth2/token', {form: {
    code: ctx.query.code,
    client_id: config.oauth.google.clientId,
    client_secret: config.oauth.google.clientSecret,
    redirect_uri: config.oauth.google.callbackUrl,
    grant_type: 'authorization_code'
  }});
  var token = JSON.parse(tokenResponse.body);
  if (!token.access_token) {
    ctx.redirect('/login');
    return;
  }

  // get user profile (including email address) from facebook and save user data in our database if necessary
  var profileResponse = await request.get('https://www.googleapis.com/plus/v1/people/me?access_token=' + token.access_token);
  var profile = JSON.parse(profileResponse.body);
  var user = await mongo.users.findOne({email: profile.emails[0].value}, {email: 1, name: 1});
  if (!user) {
    user = {
      _id: (await mongo.getNextSequence('userId')),
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: (await request.get(profile.image.url, {encoding: 'base64'})).body
    };
    var results = await mongo.users.insert(user);
  }

  // redirect the user to index page along with user profile object as query string
  user.id = user._id;
  delete user._id;
  user.picture = '/api/users/' + user.id + '/picture';
  var token = jwt.sign(user, config.app.secret);
  ctx.redirect('/?user=' + encodeURIComponent(JSON.stringify({token: token, user: user})));
}
