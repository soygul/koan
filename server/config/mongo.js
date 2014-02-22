'use strict';

var comongo = require('co-mongodb'),
    config = require('./config');

exports.connect = function *() {
  if (exports.db) {
    yield comongo.db.close(exports.db);
  }

  // export db instance
  var db = exports.db = yield comongo.client.connect(config.mongo.url);

  // export default collections
  exports.counters = yield comongo.db.collection(db, 'counters');
  exports.users = yield comongo.db.collection(db, 'users');

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
};