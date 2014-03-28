'use strict';

/**
 * WebSocket server for real-time client-server communication.
 */

/*
 * todo: use json-rpc notification schema (http://www.jsonrpc.org/specification#notification) with websockets to notify connected clients of server-side updates:
 * server --> client : {"jsonrpc": "2.0", "method": "postCreated", "params": [{"id": "123", "from": "John Doe", "message": "blah blah..."]}
 *
 * also the ws connection should be used in bidirectional manner with a casual http fallback, with a framework like koa-ws
 */

var WebSocketServer = require('ws').Server,
    url = require('url'),
    jwt = require('koa-jwt'),
    config = require('../config/config');

/**
 * Creates and attaches a WebSocket server to a given HTTP server with the same host URI.
 * @param server Node.js HTTP server instance.
 * @returns {WebSocketServer}
 */
exports.create = function (server) {
  // create a new WebSocket server
  var wss = new WebSocketServer({server: server, verifyClient: function (info) {
    // validate the connecting client's access token
    // validator function attaches user details to the request object if token is valid
    var query = url.parse(info.req.url, true).query,
        accessToken = query.access_token;

    return (info.req.user = jwt.verify(accessToken, config.app.secret)(function (err, jwtPayload) {
      return jwtPayload; // this bit is a bit of hack to make a sync function out of thunkified async function!
    }));
  }});

  // WebSocket event that is fired when a new client is validated and connected
  wss.on('connection', function (ws) {
    var user = ws.upgradeReq.user;
    console.log('A new WebSocket client connected with ID: ' + user.id);

    // associate connecting user ID with WebSocket connection in the clients dictionary
    if (exports.clients[user.id]) {
      exports.clients[user.id].push(ws);
    }
    else {
      exports.clients[user.id] = [ws];
    }

    ws.on('close', function () {
      console.log('A WebSocket client with ID: ' + user.id + ' disconnected.');
      if (exports.clients[user.id].length === 1) {
        exports.clients[user.id] = null; // exports.clients.splice(user.id, 1); // this is the correct way but this also shifts all elements indexes which spoils the design here..
      }
      else {
        var index = exports.clients[user.id].indexOf(ws);
        exports.clients[user.id].splice(index, 1);
      }
    });

    ws.on('error', function (err) {
      console.log('A WebSocket error occurred: %s', err);
    });

    ws.on('message', function (data) {
      console.log('A WebSocket message received: %s', JSON.parse(data));
    });
  });

  this.wss = wss;
  return wss;
};

/**
 * Dictionary (array of arrays) to math connected user IDs with connected clients (i.e. one user might be connected from multiple devices).
 * Array index is the client ID and the stored is also an array with socket client objects. i.e. clients[33452234]: [ws1, ws2, ws3...]
 */
exports.clients = [];

/**
 *
 * @param recipients - Array of user IDs to send the data to. Only the online clients receive the data out of the entire given recipient list.
 * @param data - JS object (which will be serialized to JSON before being sent to the clients).
 * @param callback - Optional callback to be called when
 */
exports.send = function (recipients, data, callback) {
  if (!Array.isArray(recipients)) {
    recipients = [recipients];
  }
  data = JSON.stringify(data);

  if (!callback) {
    // send the data to only the online recipients
    var send = function (client) {
      client.send(data, handleWsError);
    };

    for (var i = 0; i < recipients.length; i++) {
      var recipient = recipients[i],
          onlineClients = exports.clients[recipient];
      if (onlineClients) {
        onlineClients.forEach(send);
      }
    }
  } else {
    // this part requires recursive async callback series while passing on the err array to the callback function in the end..
  }
};

function handleWsError(err) {
  /* ignore errors */
  // The callback is also the only way of being notified that data has actually been sent.
  // if error is null, the send has been completed,
  // otherwise the error object will indicate what failed.
  if (err) {
    console.log('A WebSocket error occurred: %s', err);
  }
}

exports.postCreated = function (recipients, post) {
  exports.send(recipients, {jsonrpc: '2.0', method: 'postCreated', params: post});
};

exports.commentCreated = function (recipients, comment) {
  exports.send(recipients, {jsonrpc: '2.0', method: 'commentCreated', params: comment});
};