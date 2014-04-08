'use strict';

var passport = require('passport'),
  querystring = require('querystring');

function google(req, res, next) {
  req.session.google_auth_query = req.query;
  passport.authenticate('google', {
    scope: [
      'openid',
      'email',
      'https://www.googleapis.com/auth/calendar'
    ]
  })(req, res, next);
}

function googleCallback(req, res, next) {
  var qs = querystring.stringify(req.session.google_auth_query);
  delete req.session.google_auth_query;
  passport.authenticate('google', {
    successRedirect: '/' + (qs ? '?' + qs : ''),
    failureRedirect: '/' + (qs ? '?' + qs : ''),
    failureFlash: true
  })(req, res, next);
}

// Public API
exports.google = google;
exports.googleCallback = googleCallback;