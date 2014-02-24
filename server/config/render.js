'use strict';

var views = require('co-views');

// setup views mapping .html to the swig template engine
// also set up views directory location
module.exports = views(__dirname + '/../views', {
  map: { html: 'swig' }
});