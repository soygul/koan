'use strict';

var mongo = require('../../server/config/mongo');

/**
 * Populates the database with seed data.
 * @param overwrite Overwrite existing database even if it is not empty.
 */
module.exports = function *(overwrite) {
  var count = yield mongo.users.count({}, {limit: 1});
  if (overwrite || count === 0) {
  }
};