var session = require('koa-session'),
    logger = require('koa-logger'),
    route = require('koa-route');

module.exports = function (app) {
  var env = process.env.NODE_ENV || 'development';

  // middleware configuration
  app.keys = ['some secret hurr'];
  if (env != 'test') app.use(logger());
  app.use(session());

  // routes
  app.use(function *() {
    var n = this.session.views || 0;
    this.session.views = ++n;
    this.body = n + ' views';
  });

  app.use(route.get('/', list));
  app.use(route.get('/post/:id', show));
  app.use(route.post('/post', create));

  function *list() {
    this.body = yield render('list', { posts: posts });
  }

  function *show(id) {
    var post = posts[id];
    if (!post) this.throw(404, 'invalid post id');
    this.body = yield render('show', { post: post });
  }

  function *create() {
    var post = yield parse(this);
    var id = posts.push(post) - 1;
    post.created_at = new Date;
    post.id = id;
    this.redirect('/');
  }
};