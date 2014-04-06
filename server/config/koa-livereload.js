
/**
 * This is a temporary file till a bug (https://github.com/yosuke-furukawa/koa-livereload/issues/4) in the actual 'koa-livereload' package is fixed.
 * Or we can actually switch to a general purpose script injector which might also be useful for other things..
 */

var Transform = require('stream').Transform;
var assert = require('assert');
var util = require('util');
util.inherits(StreamInjecter, Transform);

function StreamInjecter(option) {
  Transform.call(this, option);
  this.matchRegExp = option.matchRegExp || /(<\/body>)/;
  this.injectString = option.inject || assert(true, "Error! : need injectString");
  this.replaceString = option.replace|| this.injectString + "$1";
  this.ignoreString = option.ignore || "";
  this.memoryBuffer = "";
}

StreamInjecter.prototype._transform = function(chunk, encoding, cb) {
  var buffer = (Buffer.isBuffer(chunk)) ?
      chunk :  // already is Buffer use it
      new Buffer(chunk, enc);
  this.memoryBuffer += buffer;
  cb();
};


StreamInjecter.prototype._flush = function(cb) {
  if (this.memoryBuffer.match(this.ignoreString)) cb();

  this.memoryBuffer = this.memoryBuffer.replace(this.matchRegExp, this.replaceString);
  this.push(this.memoryBuffer);

  cb();
};

module.exports = livereload;


function livereload(opts) {
  opts = opts || {};
  var port = opts.port || 35729;
  var src = opts.src || "' + (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + port + "/livereload.js?snipver=1";
  var snippet = "\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n";
  return function *livereload(next) {
    yield* next;

    if (this.response.type && this.response.type.indexOf('html') < 0) return;

    if (opts.excludes) {
      var path = this.path;
      if (opts.excludes.some(function (exlude) {
        return path.substr(0, exlude.length) === exlude;
      })) return;
    }

    // Buffer
    if (Buffer.isBuffer(this.body)) {
      this.body = this.body.toString();
    }

    // string
    if (typeof this.body === 'string') {
      if (this.body.match(/livereload.js/)) return;
      this.body = this.body.replace(/<\/body>/, snippet + "<\/body>");
    }

    // stream
    if (this.body && typeof this.body.pipe === 'function') {
      var injecter = new StreamInjecter({
        matchRegExp : /(<\/body>)/,
        inject : snippet,
        replace : snippet + "$1",
        ignore : /livereload.js/
      });
      var size = +this.response.header['content-length'];

      if (size) this.set('Content-Length', size + snippet.length);
      this.body = this.body.pipe(injecter);
    }
  };
}
