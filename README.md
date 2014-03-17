[![KOAN](https://raw.github.com/soygul/koan/master/client/img/koan_large.png)](http://koanjs.com/)

[![Build Status](https://travis-ci.org/soygul/koan.png?branch=master)](https://travis-ci.org/soygul/koan)

KOAN Stack is a boilerplate that provides a nice starting point for [Koa](http://koajs.com/), [AngularJS](http://angularjs.org/), and [Node.js](http://www.nodejs.org/) based applications. It is designed to give you quick and organized way to start development of KOAN based Web apps with additional useful modules like [MongoDB](http://www.mongodb.org/), [Passport](http://passportjs.org/) and [Grunt](http://gruntjs.com/) tasks, pre-bundled and configured. We mainly try to take care of the connection points between existing popular frameworks and solve common integration problems.

## Getting Started
Make sure that you have Node.js and MongoDB (running on the default port 27017) installed on your computer. To get started with KOAN stack, clone the project repository and do following:

```bash
npm install
npm start
```

Your application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)

## Configuration
All configuration is specified in the [config](config/) folder, particularly the [config.js](config/config.js) file. Here you will need to specify your database name and hook up any social app keys if you want integration with Twitter, Facebook, or Google.

## Heroku Deployment
Before you start make sure you have <a href="https://toolbelt.heroku.com/">heroku toolbelt</a> installed.

```bash
git init
git add .
git commit -m "initial version"
heroku apps:create
heroku addons:add mongohq
heroku config:add NODE_ENV=production
git push heroku master
heroku open
```

## Receiving updates from upstream
When we upgrade KOAN's repo with updates or patches, you can just fetch the changes and merge them into your project with git.

## Live Example
Browse the live KOAN example on [http://koanjs.com](http://koanjs.com).

## Third Party Framework Documentation
Before you begin we recommend you read about the basic building blocks that assemble a KOAN application:
* Koa - The best way to understand Koa is through its [Official Website](http://koajs.com/).
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and the [Egghead Videos](https://egghead.io/).
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and [Node.js Driver Manual](http://mongodb.github.io/node-mongodb-native/).

## Credits
This project puts the best parts from following project together: [Angular Seed](https://github.com/angular/angular-seed), [MEAN](https://github.com/linnovate/mean), and [AngularJS Full Stack](https://github.com/DaftMonk/generator-angular-fullstack).

## The Name
The project name is an acronym for Koa, Angular, and Node. It also is the name for a Zen Buddhist riddle used to focus the mind during meditation and to develop intuitive thinking.

## License
MIT