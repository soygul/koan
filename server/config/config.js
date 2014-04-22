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
    },
    oauth: {
      facebook: {
        clientId: '231235687068678',
        clientSecret: '4a90381c6bfa738bb18fb7d6046c14b8',
        callbackUrl: 'http://localhost:3000/login/facebook/callback'
      },
      google: {
        clientId: '147832090796-ckhu1ehvsc8vv9nso7iefvu5fi7jrsou.apps.googleusercontent.com',
        clientSecret: 'MGOwKgcLPEfCsLjcJJSPeFYu',
        callbackUrl: 'http://localhost:3000/login/google/callback'
      }
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
    oauth: {
      facebook: {
        clientId: '231235687068678',
        clientSecret: '4a90381c6bfa738bb18fb7d6046c14b8',
        callbackUrl: 'http://koanjs.com/login/facebook/callback'
      },
      google: {
        clientId: '147832090796-ckhu1ehvsc8vv9nso7iefvu5fi7jrsou.apps.googleusercontent.com',
        clientSecret: 'MGOwKgcLPEfCsLjcJJSPeFYu',
        callbackUrl: 'http://koanjs.com/login/google/callback'
      }
    }
  }
};

// override the base configuration with the platform specific values
_.merge(baseConfig, platformConfig[baseConfig.app.env]);
module.exports = baseConfig;