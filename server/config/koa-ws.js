'use strict';

/**
 * Koa real-time middleware using WebSockets.
 */

var ws = require('./ws');

module.exports = function (opts) {
  return function *ws(next) {
    // 1. check if this response is for a json-rpc request (with a proper id) through websocket
    // 2. check if we need to broadcast anything to anyone even if it's not a direct response for the request
  };
}