'use strict';

var util = require('util');

var _ = require('lodash'),
  wrench = require('wrench'),
  mongoose = require('mongoose');

var config = require.config(__dirname + '/../config');

// Create an app
var app = {
  config: config,
  dir: __dirname,
  project: require('../project'),
  routes: require('./routes'),
  server: {}
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

// Load modules
app.lib = require(app.dir + '/lib');
app.models = require(app.dir + '/models');
app.views = fs.globSync(app.dir + '/views/**/*.html');
app.controllers = require(app.dir + '/controllers');

app.attachMiddlewares = function (express) {
  // Remove trailing slashes
  express.middleware.removeTrailingSlashes.attach(app);

  // Method override
  express.middleware.methodOverride.attach(app);
  // Hide Powered-by header
  express.middleware.hidePoweredByHeader.attach(app);

  // Cache bust
  express.middleware.cachebust.attach(app);

  // Custom
  app.servers.express.getServer().use(function (req, res, next) {
    req._routeWhitelists.req = ['ip'];

    if (process.env.NODE_ENV === 'development') {
      res.locals.livereload = app.project.server.livereload;
    }
    res.locals.user = req.user;
    req.session.ultimate = req.session.ultimate || {};
    next();
  });
};

mongoose.connect(app.config.db.mongo);
// Start server
app.servers.express.run(app);