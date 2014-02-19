'use strict';

var path = require('path'),
    _ = require('lodash');

/**
 * Environment variables and application configuration.
 */
module.exports = env;

var env = {
  app: {
    root: path.normalize(__dirname + '/../..'),
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    masterToken: process.env.MASTER_TOKEN || 'master token secret'
  },
  mongo: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/koan'
  },
  setEnv: function (e) {
    env = _.extend(env, conf[e]);
  }
};

var conf = {
  dev: {
    app: {
      env: 'development'
    },
    mongo: {
      uri: 'mongodb://localhost:27017/koan-dev'
    }
  },

  test: {
    app: {
      port: 3001,
      env: 'test'
    },
    mongo: {
      uri: 'mongodb://localhost:27017/koan-test'
    }
  },

  prod: {
    app: {
      env: 'production',
      masterToken: null
    },
    mongo: {
      uri: 'mongodb://localhost:27017/koan'
    },
    passport: {
      facebook: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
      },
      twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
      },
      google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/google/callback'
      }
    }
  },

  staging: {
    app: {
      port: 3002,
      env: 'staging',
      masterToken: null
    },
    mongo: {
      uri: 'mongodb://localhost:27017/koan-staging'
    }
  }
};