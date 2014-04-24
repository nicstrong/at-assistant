'use strict';

var app = require('../../app');

var _ = require('lodash'),
  http = require('http'),
  Q = require('q'),
  User = app.models.User;

var gcal = require('google-calendar');

function writableCalendar(cal) {
  return cal.accessRole === "owner" || cal.accessRole == "writer";
}

function watchCalendar(req, res) {
}

function watchedCalendarsForSession(req, res) {
  apiForSession(req, res, watchedCalendarsForUser);
}

function watchedCalendarsForUserId(req, res) {
 apiForUserId(req, res, watchedCalendarsForUser);
}

function watchedCalendarsForUser(req, res, user) {
  res.send(user.calendars);
}

function allCalendarsForSession(req, res) {
  apiForSession(req, res, allCalendarsForUser);

  resloveUserFromSession(req, res).then(allCalendarsForUser);
}

function allCalendarsForUserId(req, res) {
  apiForUserId(req, res, allCalendarsForUser);
}

function allCalendarsForUser(req, res, user) {
  var calendar = new gcal.GoogleCalendar(user.auth.google.token);
  calendar.calendarList.list(function (err, calendarList) {
    if (err) {
      app.logger.error('calendar: '.cyan + err.message);
      return res.send(err.code || 400, err.message);
    }
    res.send(_.map(
      _.filter(calendarList.items, writableCalendar),
      _.partialRight(
        _.pick, ['id', 'summary', 'description', 'backgroundColor'])));
}

function resolveUserFromSession(req, res) {
  if (_.isNull(req.user) || _.isUndefined(req.user)) {
    res.send(401);
    return Q.fcall(function () {
      return new Error("No user in session");
    });
  }
  return Q.fcall(function () {
    return req.user;
  });
}

function resolveUserFromUrl(req, res) {
  var deferred = Q.defer();
  User.findOne({_id: req.params.userId},
    function (err, user) {
      if (err) {
        app.logger.error('calendar: '.cyan + err.message);
        res.send(400);
        deferred.reject();
      }

      if (_.isNull(user)) {
        res.send(404);
        deferred.reject();
      }
      return deferred.resolve(req, res, user);
    });

  return deferred.promise;
}

// Public API
exports.watchCalendar = watchCalendar;
exports.watchedCalendarsForSession = watchedCalendarsForSession;
exports.watchedCalendarsForUserId = watchedCalendarsForUserId;
exports.allCalendarsForSession = allCalendarsForSession;
exports.allCalendarsForUserId = allCalendarsForUserId;
