'use strict';

var path = require('path'),
    _ = require('lodash');

/**
 * Environment variables and application configuration.
 */
var baseConfig = {
  app: {
    root: path.normalize(__dirname + '/../..'),
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    secret: 'secret key' /* used in signing the jwt tokens */
  },
  mongo: {
    url: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/koan'
  }
};

var platformConfig = {
  development: {
    mongo: {
      url: 'mongodb://localhost:27017/koan-dev'
    }
  },

  test: {
    app: {
      port: 3001
    },
    mongo: {
      url: 'mongodb://localhost:27017/koan-test'
    }
  },

  production: {
    app: {
      cacheTime: 7 * 24 * 60 * 60 * 1000 /* default caching time (7 days) for static files, calculated in milliseconds */
    },
    passport: {
      facebook: {
        clientID: '231235687068678',
        clientSecret: '4a90381c6bfa738bb18fb7d6046c14b8',
        callbackURL: 'http://localhost:3000/login/facebook/callback'
      },
      twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/login/twitter/callback'
      },
      google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/login/google/callback'
      }
    }
  }
};

// override the base configuration with the platform specific values
_.merge(baseConfig, platformConfig[baseConfig.app.env]);
module.exports = baseConfig;