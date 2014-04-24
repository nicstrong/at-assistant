'use strict';

var util = require('util');
var _ = require('lodash'),
  mongooseFindOrCreate = require('mongoose-findorcreate');


var app = require('../app');
var mongoose = app.mongoose;

// Schema
var schema = new mongoose.Schema({
  gcalId: { type: String, required: true },
  description: { type: String },
  summary: { type: String },
  backgroundColor: { type: String }
});

// Indexes
schema.path('gcalId').index({ unique: true });

// Plugins
schema.plugin(mongooseFindOrCreate);

// Model
var model = mongoose.model('Calendar', schema);

// Public API
exports = module.exports = model;