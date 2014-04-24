'use strict';

exports.register = function (app, express) {

  var c = app.controllers,
    error404 = app.utils.controller.error404;


  express.get('/api', function (req, res) {
    res.send('<html><span>AT Assistant API</span></html>');
  });
  express.get('/api/tests', c.api.test.tests);
  express.get('/api/test/:id', c.api.test.test);

  express.get('/api/user/:userId/calendars/all', c.api.calendar.allCalendarsForUserId);
  express.get('/api/calendars/all', c.api.calendar.allCalendarsForSession);

  express.post('/api/user/:userId/calendar/:calendarId/watch', c.api.calendar.watchCalendar);


  express.post('/api/logout', c.api.auth.logout);
  express.get('/api/me', c.api.auth.me);


  // Home
  express.get('/', c.home.index);
  express.get('/express', c.home.express);
  express.get('/page', c.home.page);

  // Auth
  express.get('/auth/google', c.auth.google);
  express.get('/auth/google/callback', c.auth.googleCallback);


  // Catch all
  express.get('*', app.utils.controller.catchAll);
}
