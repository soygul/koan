'use strict';

var mongo = require('./mongo'),
    ObjectID = mongo.ObjectID;

/**
 * Populates the database with seed data.
 * @param overwrite Overwrite existing database even if it is not empty.
 */
module.exports = function *(overwrite) {
  var count = yield mongo.users.count({}, {limit: 1});
  if (overwrite || count === 0) {

    // first remove any leftover data in collections
    var collerrmsg = 'ns not found' /* indicates 'collection not found' error in mongo which is ok */;
    for (var collection in mongo) {
      if (mongo[collection].drop) {
        try {
          yield mongo[collection].drop();
        } catch (err) {
          if (err.message !== collerrmsg) {
            throw err;
          }
        }
      }
    }

    // now populate collections with fresh data
    yield mongo.counters.insert({_id: 'userId', seq: users.length});
    yield mongo.users.insert(users);
    yield mongo.posts.insert(posts);
  }
};

// declare seed data
var users = [
  {
    _id: 1,
    email: 'teo@koanjs.com',
    password: 'pass',
    name: 'Teoman Soygul',
    picture: '/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABaAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MSA2NC4xNDA5NDksIDIwMTAvMTIvMDctMTA6NTc6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYwRDJGRDkxMjEwNTExRTM4ODVCRjE3Mzc1MDA2NDM2IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYwRDJGRDkwMjEwNTExRTM4ODVCRjE3Mzc1MDA2NDM2IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjlFNkY0RjVDMzEyMTFFMjk5QkZBQ0I3ODZDODdCRTUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjlFNkY0RjZDMzEyMTFFMjk5QkZBQ0I3ODZDODdCRTUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAgEBAQICAgEB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'
  },
  {
    _id: 2,
    email: 'chuck@koanjs.com',
    password: 'pass',
    name: 'Chuck Norris',
    picture: '/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABVAAD/4QNvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6QkU0QUI3Q0Y1RkFCRTExMTk2QzdBM0EwMkJFQ0QwMEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUFBMjNFNUE4RTc3MTFFMjhDNjhBMTVGNkExNzJFN0IiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUFBMjNFNTk4RTc3MTFFMjhDNjhBMTVGNkExNzJFN0IiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3ODNGQUQ2MEFFNjIxMUUxODdCMEVGOURDRkNGMDBGRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3ODNGQUQ2MUFFNjIxMUUxODdCMEVGOURDRkNGMDBGRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6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'
  }
];


var now = new Date();
function getTime(h) {
  return new Date(new Date(now).setHours(now.getHours() + h));
}

var posts = [
  {
    _id: new ObjectID(),
    from: {_id: 1, name: 'Teoman Soygul', picture: 'api/users/1/picture'},
    message: 'Hi guys, I\'m traveling to Bolivia for the weekend!',
    createdTime: getTime(-97),
    updatedTime: getTime(-24),
    comments: [
      {
        _id: new ObjectID(),
        from: {_id: 2, name: 'Chuck Norris', picture: 'api/users/2/picture'},
        createdTime: getTime(-26),
        message: 'Don\'t forget to bring back an iguana:)'
      },
      {
        _id: new ObjectID(),
        from: {_id: 1, name: 'Teoman Soygul', picture: 'api/users/1/picture'},
        createdTime: getTime(-24),
        message: 'I will!.'
      }
    ]
  },
  {
    _id: new ObjectID(),
    from: {_id: 2, name: 'Chuck Norris', picture: 'api/users/2/picture'},
    message: 'Hello world! This is a sample post... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc feugiat neque dui, vel fermentum arcu egestas vitae. Curabitur tincidunt tristique tristique. Nunc velit sapien, laoreet non enim vel, vestibulum blandit magna. Vivamus pharetra tempus mi, id ullamcorper dolor adipiscing at. Aliquam sed malesuada sapien. Sed enim nisi, rhoncus nec sollicitudin quis, mattis sed eros. Etiam luctus aliquam tristique. Aenean condimentum justo arcu, sit amet vestibulum neque suscipit sit amet. Nunc mattis enim eget turpis semper bibendum. Quisque blandit diam tincidunt lacus malesuada, vel faucibus risus hendrerit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque viverra tellus bibendum, elementum urna ultricies, elementum enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nam nunc turpis, commodo id ipsum ac, rhoncus auctor ligula. Proin in nulla in lorem commodo semper. Aenean sodales turpis vitae tempor sollicitudin.',
    createdTime: getTime(-28)
  }
];