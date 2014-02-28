'use strict';

var config = require('../config/config');

/**
 * Provides access token based authentication middleware for koa. If the request is authenticated, a user object is appended to the koa context.
 * Otherwise, a 401 error is thrown. Simple usage is: app.use(auth({path: '/api'}));
 */
module.exports = function (opts) {
  opts = opts || {};
  opts.path = opts.path || '/';
  opts.masterToken = opts.masterToken || config.app.masterToken;

  return function *(next) {
    var path = this.request.url.substr(0, opts.path.length);
    if (path === opts.path && !(this.user = auth(this))) {
      this.throw(401);
    } else {
      yield next;
    }
  };
};

function auth(ctx) {
  var accessToken = ctx.request.query.access_token;
  return verify(accessToken);
}

function verify(accessToken) {
  return {};
}