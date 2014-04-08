'use strict';

var util = require('util');

var _ = require('lodash'),
  wrench = require('wrench'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  mongooseTypes = require("mongoose-types"),
  requireDir = require('require-dir'),
  express = require('./server/express'),
  passport = require('passport'),
  http = require('./server/http'),
  mongooseConnect = require('./db/mongoose/connect'),
  glob = require('glob');


var config = require('./config')(__dirname + '/../config');

// Create an app
var app = {
  config: config,
  dir: __dirname,
  mongoose: {},
  project: require('../project'),
  routes: require('./routes'),
  servers: {}
};

// Assign app to exports
exports = module.exports = app;

// Attach winston logger
wrench.mkdirSyncRecursive(app.project.path.log);
require('./winston').attach(app);

// Debug
app.logger.debug('app.project: '.cyan +
  JSON.stringify(app.project, null, 2));
app.logger.debug(util.format('app.config (%s): ', process.env.NODE_ENV).cyan +
  JSON.stringify(app.config, null, 2));

// Defaults for config
_.defaults(app.config, {
  url: app.config.url || 'http://localhost:' + app.project.server.port
});

mongooseTypes.loadTypes(mongoose);
var useTimestamps = mongooseTypes.useTimestamps;
app.mongoose = mongoose;

// Load modules
app.utils = requireDir(app.dir + '/util', { recurse: true });
app.models = requireDir(app.dir + '/models');
app.views = glob.sync(app.dir + '/views/**/*.html');
app.controllers = requireDir(app.dir + '/controllers', { recurse: true });

app.attachMiddlewares = function (express) {
//  // Remove trailing slashes
//  express.middleware.removeTrailingSlashes.attach(app);
//
//  // Method override
//  express.middleware.methodOverride.attach(app);
//  // Hide Powered-by header
//  express.middleware.hidePoweredByHeader.attach(app);
//
//  // Cache bust
//  express.middleware.cachebust.attach(app);

  // Passport
  app.servers.express.getServer().use(passport.initialize());
  app.servers.express.getServer().use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    app.models.User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // Passport strategies
  require('./server/middleware/passport/google').attach(app);

  // Custom
  app.servers.express.getServer().use(function (req, res, next) {
    req._routeWhitelists.req = ['ip'];

    if (process.env.NODE_ENV === 'development') {
      res.locals.livereload = app.project.server.livereload;
    }
    res.locals.user = req.user;
    req.session.atassistant = req.session.atassistant || {};
    next();
  });
};

app.run = function () {
  mongooseConnect.connect(mongoose, app.config.db.mongo);

  // Start servers
  express.run(app);
  http.run(app)

  return app.servers.http.getServer();
}