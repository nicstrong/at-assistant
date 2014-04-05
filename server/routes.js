'use strict';

exports.register = function (app, express) {

  var c = app.controllers,
    error404 = app.utils.controller.error404;

  // Home
  express.get('/', c.home.index);


  // Catch all
  express.get('*', app.utils.controller.catchAll);
}
