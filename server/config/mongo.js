'use strict';

/**
 * MongoDB configuration using generators (with the help of co-mongo package).
 * You can require this config file in your controllers and start using named collections directly.
 * See /controllers directory for sample usage.
 */

var mongodb = require('mongodb'),
    connect = mongodb.connect,
    config = require('./config');

// extending and exposing top co-mongo namespace like this is not optimal but it saves the user from one extra require();
module.exports = mongodb;

/**
 * Opens a new connection to the mongo database, closing the existing one if exists.
 */
mongodb.connect = function *() {
  if (mongodb.db) {
    yield mongodb.db.close();
  }

  // export mongo db instance
  var db = mongodb.db = yield connect(config.mongo.url);

  // export default collections
  mongodb.counters = db.collection('counters');
  mongodb.users = db.collection('users');
  mongodb.posts = db.collection('posts');
};

/**
 * Retrieves the next sequence number for the given counter (indicated by @counterName).
 * Useful for generating sequential integer IDs for certain collections (i.e. user collection).
 */
mongodb.getNextSequence = function *(counterName) {
  var results = yield mongodb.counters.findAndModify(
      {_id: counterName},
      [],
      {$inc: {seq: 1}},
      {new: true}
  );
  return results.value.seq;
};