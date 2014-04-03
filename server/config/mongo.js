'use strict';

var comongo = require('co-mongo'),
    connect = comongo.connect,
    config = require('./config');

// extending top mongo namespace like this is not optimal but it saves the user from a lot of extra configuration & confusion
module.exports = comongo;

/**
 * Opens a new connection to the mongo database, closing the existing one if exists.
 */
comongo.connect = function *() {
  if (comongo.db) {
    yield comongo.db.close();
  }

  // export mongo db instance
  var db = comongo.db = yield connect(config.mongo.url);

  // export default collections
  comongo.counters = yield db.collection('counters');
  comongo.users = yield db.collection('users');
  comongo.posts = yield db.collection('posts');
};

/**
 * Retrieves the next sequence number for the given counter (indicated by @counterName).
 * Useful for generating sequential integer IDs for certain collections (i.e. user collection).
 */
comongo.getNextSequence = function *(counterName) {
  return yield comongo.counters.findAndModify(
      {_id: counterName},
      [],
      {$inc: {seq: 1}},
      {new: true}
  );
};