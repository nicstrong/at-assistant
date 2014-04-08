
'use strict';

var _ = require('lodash'),
    S = require('string');

var app = require('../../app');

function logout(req, res) {
  // Log out.
  req.logout();
  return res.send({ success: true });
}

function me(req, res) {
  return res.send(req.user ? req.user.getSafeJSON() : null);
}


// Public API
exports.logout = logout;
exports.me = me;
