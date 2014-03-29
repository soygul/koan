
/**
 * This is a temporary file till a bug (https://github.com/yosuke-furukawa/koa-livereload/issues/4) in the actual 'koa-livereload' package is fixed.
 */

var StreamInjecter = require('stream-injecter');

module.exports = livereload;

function livereload() {
  var snippet = '<script src="//localhost:35729/livereload.js"></script>';
  return function *livereload(next) {
    yield* next;

    if (this.path.substr(0, 10).toLowerCase() === '/partials/') return;

    if (this.response.type && this.response.type.indexOf('html') < 0) return;

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