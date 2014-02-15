module.exports = function (app) {
  app.use(function *(){
    this.body = 'Hello World';
  });
};