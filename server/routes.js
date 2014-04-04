'use strict';
                                         s
exports.register = function (app, express) {

  var c = app.controllers,
    error404 = app.lib.controller.error404;

  // Home
  s.get('/', c.home.index);


  // Catch all
  s.get('*', app.lib.controller.catchAll);
}
