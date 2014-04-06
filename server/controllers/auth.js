function google(req, res, next) {
  req.session.googleauth.query = req.query;
  passport.authenticate('google', {
    scope: [
      'openid',
      'email',
      'https://www.googleapis.com/auth/calendar'
    ]
  })(req, res, next);
}

function googleCallback(req, res, next) {
  var qs = querystring.stringify(req.session.googleauth.query);
  delete req.session.googleauth.query;
  passport.authenticate('google', {
    successRedirect: '/login' + (qs ? '?' + qs : ''),
    failureRedirect: '/login' + (qs ? '?' + qs : ''),
    failureFlash: true
  })(req, res, next);
}

// Public API
exports.google = google;
exports.googleCallback = googleCallback;