var koa = require('koa'),
    app = module.exports = koa();

// koa config
require('./server/config/koa')(app);

if (!module.parent) app.listen(3000);