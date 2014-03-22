'use strict';

var comongo = require('co-mongo'),
    config = require('./config');

/**
 * Opens a new connection to the mongo database, closing the existing one if exists.
 */
exports.connect = function *() {
  if (exports.db) {
    yield exports.db.close();
  }

  // export mongo db instance
  var db = exports.db = yield comongo.connect(config.mongo.url);

  // export default collections
  exports.counters = yield db.collection('counters');
  exports.users = yield db.collection('users');
  exports.posts = yield db.collection('posts');
};

/**
 * Retrieves the next sequence number for the given counter (indicated by @counterName).
 */
exports.getNextSequence = function *(counterName) {
  return yield exports.counters.findAndModify(
      {_id: counterName},
      [],
      {$inc: {seq: 1}},
      {new: true}
  );
};