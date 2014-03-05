# KOAN Stack
[![Build Status](https://travis-ci.org/soygul/koan.png)](https://travis-ci.org/soygul/koan)

KOAN is a boilerplate that provides a nice starting point for [Koa](http://koajs.com/), [AngularJS](http://angularjs.org/), and [Node.js](http://www.nodejs.org/) based applications. It is designed to give you quick and organized way to start development of KOAN based Web apps with additional useful modules like [MongoDB](http://www.mongodb.org/), [Passport](http://passportjs.org/) and [Grunt](http://gruntjs.com/) tasks, pre-bundled and configured. We mainly try to take care of the connection points between existing popular frameworks and solve common integration problems.

## Quick Start

### Prerequisites
Make sure you have installed all these prerequisites on your development machine.
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [Github Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

```
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```
$ npm install -g grunt-cli
```

### Installation
The quickest way to get started with KOAN is to clone the project repository and do following:

Install dependencies:

```
$ npm install
```

After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)

## Configuration
All configuration is specified in the [config](config/) folder, particularly the [config.js](config/config.js) file. Here you will need to specify your application name, database name, as well as hook up any social app keys if you want integration with Twitter, Facebook, or Google.

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

	$ NODE_ENV=test node --harmony app

> NOTE: Running Node.js applications in the __production__ environment enables caching, which is disabled by default in all other environments.

## Heroku Deployment
Before you start make sure you have <a href="https://toolbelt.heroku.com/">heroku toolbelt</a> installed and an accessible mongo db instance - you can try <a href="http://www.mongohq.com/">mongohq</a> which have an easy setup.

```bash
git init
git add .
git commit -m "initial version"
heroku apps:create
git push heroku master
```

## Receiving updates from upstream
When we upgrade KOAN's repo with updates or patches, you can just fetch the changes and merge them into your project with git.

## Third Party Framework Documentation
Before you begin we recommend you read about the basic building blocks that assemble a KOAN application:
* Koa - The best way to understand Koa is through its [Official Website](http://koajs.com/).
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and the [Egghead Videos](https://egghead.io/).
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.

## Main Packages
* Koa - Defined as npm module in the [package.json](package.json) file.
* AngularJS - Defined as bower module in the [bower.json](bower.json) file.
* MongoDB - Defined as npm module in the [package.json](package.json) file.
* Passport - Defined as npm module in the [package.json](package.json) file.
* Twitter Bootstrap - Defined as bower module in the [bower.json](bower.json) file.
* UI Bootstrap - Defined as bower module in the [bower.json](bower.json) file.

## Troubleshooting
During install some of you may encounter some issues, most of this issues can be solved by one of the following tips.

### Update NPM, Bower or Grunt
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

### Cleaning NPM and Bower cache
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

## Credits
This project puts the best parts from following: [Angular Seed](https://github.com/angular/angular-seed), [MEAN](https://github.com/linnovate/mean), [AngularJS Full Stack](https://github.com/DaftMonk/generator-angular-fullstack).

## The Name
The project name is an acronym for Koa, Angular, and Node. It also is the name for a Zen Buddhist riddle used to focus the mind during meditation and to develop intuitive thinking.