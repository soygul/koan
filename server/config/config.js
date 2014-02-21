'use strict';

var path = require('path'),
    _ = require('lodash');

/**
 * Environment variables and application configuration.
 */
var base = {
  app: {
    root: path.normalize(__dirname + '/../..'),
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    masterToken: process.env.MASTER_TOKEN || 'master_token_secret'
  },
  mongo: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/koan'
  }
};

var platforms = {
  development: {
    mongo: {
      uri: 'mongodb://localhost:27017/koan-dev'
    }
  },

  test: {
    app: {
      port: 3001
    },
    mongo: {
      uri: 'mongodb://localhost:27017/koan-test'
    }
  },

  production: {
    app: {
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
      masterToken: null
    },
    mongo: {
      uri: 'mongodb://localhost:27017/koan-staging'
    }
  }
};

// override the base configuration with the platform specific values
_.assign(base, platforms[base.app.env]);
module.exports = base;