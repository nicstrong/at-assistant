'use strict';

var app = require('../../app');

var _ = require('lodash'),
  http = require('http'),
  User = app.models.User;

var gcal = require('google-calendar');

function writableCalendar(cal) {
  return cal.accessRole === "owner" || cal.accessRole == "writer";
}

function calendarsAll(req, res) {
  User.findOne({_id: req.params.userId},
    function (err, user) {
      if (err) {
        app.logger.error('calendar: '.cyan + err);
        return res.send(400);
      }

      if (_.isNull(user)) {
        return res.send(404);
      }

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
      });
    }
  );
}

// Public API
exports.calendarsAll = calendarsAll;
