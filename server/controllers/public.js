'use strict';

/**
 * Publicly accessible api endpoints. This is useful for special cases like login, user profile images, etc.
 */

var route = require('koa-route'),
    jwt = require('koa-jwt'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    config = require('../config/config');

// register koa routes
exports.init = function (app) {
  app.use(route.post('/login', login));
  app.use(route.get('/api/users/:id/picture', getPicture));
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
  var token = jwt.sign(user, config.app.secret, {expiresInMinutes: 60 * 24 * 60});
  this.body = {token: token, user: user};
}

/**
 * Serves user profile picture in 50x50 jpeg format.
 * @param id User ID.
 */
function *getPicture(id) {
  id = parseInt(id);
  var user = yield mongo.users.findOne({_id: id}, {picture: 1});
  if (user) {
    var img = new Buffer(user.picture, 'base64');
    this.set('Content-Type', 'image/jpeg');
    if (config.app.env === 'production') {
      this.set('Cache-Control', 'max-age=' + (60 * 60 * 24 * 7 /* 7 days */));
    }
    this.body = img;
  }
}