
'use strict';

var _ = require('lodash'),
    S = require('string');

var app = require('../../app');


var _testDB = [
  { id: '1', hello: 'Thanks' },
  { id: '2', hello: 'For' },
  { id: '3', hello: 'Using' },
  { id: '4', hello: 'ultimate-seed' },
  { id: '5', hello: ':)' }
];

function tests(req, res) {
  return res.send(_testDB);
}

function test(req, res) {
  var obj = _.find(_testDB, {id: req.params.id});
  if (_.isUndefined(obj)) {
    return res.send(404);
  }
  return res.send(obj);
}


// Public API
exports.tests = tests;
exports.test = test;
