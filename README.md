# KOAN Stack

[![Build Status](https://travis-ci.org/soygul/koan.png)](https://travis-ci.org/soygul/koan)

KOAN is a boilerplate that provides a nice starting point for [Koa](http://koajs.com/), [AngularJS](http://angularjs.org/), and [Node.js](http://www.nodejs.org/) based applications. It is designed to give you quick and organized way to start development of KOAN based Web apps with additional useful modules like [MongoDB](http://www.mongodb.org/), [Passport](http://passportjs.org/) and [Grunt](http://gruntjs.com/) tasks, pre-bundled and configured. We mainly try to take care of the connection points between existing popular frameworks and solve common integration problems.

## Prerequisites
* Node.js - Download and Install [Node.js](http://www.nodejs.org/download/). You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm
* MongoDB - Download and Install [MongoDB](http://www.mongodb.org/downloads) - Make sure it's running on the default port (27017).

### Tools Prerequisites
* NPM - Node.js package manager, should be installed when you install node.js.
* Bower - Web package manager, installing [Bower](http://bower.io/) is simple when you have npm:

```
$ npm install -g bower
```

### Optional
* Grunt - Download and Install [Grunt](http://gruntjs.com).

## Additional Packages
* Koa - Defined as npm module in the [package.json](package.json) file.
* AngularJS - Defined as bower module in the [bower.json](bower.json) file.
* MongoDB - Defined as npm module in the [package.json](package.json) file.
* Passport - Defined as npm module in the [package.json](package.json) file.
* Twitter Bootstrap - Defined as bower module in the [bower.json](bower.json) file.
* UI Bootstrap - Defined as bower module in the [bower.json](bower.json) file.

## Quick Install
  The quickest way to get started with KOAN is to clone the project and utilize it like this:

  Install dependencies:

    $ npm install

  We recommend using [Grunt](https://github.com/gruntjs/grunt-cli) to start the server:

    $ grunt
    
  When not using grunt you can use:

    $ node server
    
  Then open a browser and go to:

    http://localhost:3000


## Troubleshooting
During install some of you may encounter some issues, most of this issues can be solved by one of the following tips.
If you went through all this and still can't solve the issue, feel free to contact me(Amos), via the repository issue tracker or the links provided below.

#### Update NPM, Bower or Grunt
Sometimes you may find there is a weird error during install like npm's *Error: ENOENT*, usually updating those tools to the latest version solves the issue.

Updating NPM:
```
$ npm update -g npm
```

Updating Grunt:
```
$ npm update -g grunt-cli
```

Updating Bower:
```
$ npm update -g bower
```

#### Cleaning NPM and Bower cache
NPM and Bower has a caching system for holding packages that you already installed.
We found that often cleaning the cache solves some troubles this system creates.

NPM Clean Cache:
```
$ npm cache clean
```

Bower Clean Cache:
```
$ bower cache clean
```

## Configuration
All configuration is specified in the [config](config/) folder, particularly the [config.js](config/config.js) file and the [env](config/env/) files. Here you will need to specify your application name, database name, as well as hook up any social app keys if you want integration with Twitter, Facebook, GitHub or Google.

### Environmental Settings

There are three environments provided by default, __development__, __test__, and __production__. Each of these environments has the following configuration options:
* __db__ - This is the name of the MongoDB database to use, and is set by default to __koan-dev__ for the development environment.
* __app.name__ - This is the name of your app or website, and can be different for each environment. You can tell which environment you are running by looking at the TITLE attribute that your app generates.
* __Social OAuth Keys__ - Facebook, GitHub, Google, Twitter. You can specify your own social application keys here for each platform:
	* __clientID__
	* __clientSecret__
	* __callbackURL__

To run with a different environment, just specify NODE_ENV as you call grunt:

	$ NODE_ENV=test grunt

If you are using node instead of grunt, it is very similar:

	$ NODE_ENV=test node server

> NOTE: Running Node.js applications in the __production__ environment enables caching, which is disabled by default in all other environments.

## Getting Started
  We pre-included an article example, check it out:
  * [The Model](app/models/article.js) - Where we define our object schema.
  * [The Controller](app/controllers/articles.js) - Where we take care of our backend logic.
  * [NodeJS Routes](app/routes/articles.js) - Where we define our REST service routes.
  * [AngularJs Routes](public/js/config.js) - Where we define our CRUD routes.
  * [The AngularJs Service](public/js/services/articles.js) - Where we connect to our REST service.
  * [The AngularJs Controller](public/js/controllers/articles.js) - Where we take care of  our frontend logic.
  * [The AngularJs Views Folder](public/views/articles) - Where we keep our CRUD views.

## Heroku Quick Deployment
Before you start make sure you have <a href="https://toolbelt.heroku.com/">heroku toolbelt</a> installed and an accessible mongo db instance - you can try <a href="http://www.mongohq.com/">mongohq</a> which have an easy setup )

```bash
git init
git add .
git commit -m "initial version"
heroku apps:create
git push heroku master
```

## Running unit tests
We recommend using [jasmine](http://pivotal.github.com/jasmine/) and
[Karma](http://karma-runner.github.io) for your unit tests/specs, but you are free
to use whatever works for you.

Requires [node.js](http://nodejs.org/), Karma (`sudo npm install -g karma`) and a local
or remote browser.

* start `scripts/test.sh` (on windows: `scripts\test.bat`)
  * a browser will start and connect to the Karma server (Chrome is default browser, others can be captured by loading the same url as the one in Chrome or by changing the `config/karma.conf.js` file)
* to run or re-run tests just change any of your source or test javascript files


## End to end testing
We recommend using [protractor](https://github.com/angular/protractor) for end-to-end tests. It
uses native events and has special features for Angular applications.

Requires a webserver, node.js + `./scripts/web-server.js` or your backend server that hosts the angular static files.

* create your end-to-end tests in `test/e2e/scenarios.js`
* serve your project directory with your http/backend server or node.js + `scripts/web-server.js`
* to run:
  * run the tests from console with [Protractor](https://github.com/angular/protractor) via
    `scripts/e2e-test.sh` (on windows: `scripts\e2e-test.bat`)

## Credits
This project puts the best parts from following: [Angular Seed](https://github.com/angular/angular-seed), [MEAN](https://github.com/linnovate/mean), [AngularJS Full Stack](https://github.com/DaftMonk/generator-angular-fullstack).

## The Name
The project name is an acronym for Koa, Angular, and Node. It also is the name for a Zen Buddhist riddle used to focus the mind during meditation and to develop intuitive thinking.