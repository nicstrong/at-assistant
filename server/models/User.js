'use strict';

var util = require('util');
var _ = require('lodash');

var app = require('../app');
var mongoose = app.mongoose;

// Schema
var schema = new mongoose.Schema({
  email: { type: mongoose.SchemaTypes.Email, required: true },
  name: {
    first: { type: String, required: true },
    last: { type: String }
  },
  accessToken: { type: String },
  auth: {
    local: {
      username: { type: mongoose.SchemaTypes.Email },
      password: { type: String }
    },
    google: {
      id: { type: String },
      token: { type: String },
      profile: { type: mongoose.SchemaTypes.Mixed }
    }
  }
});

// Indexes
schema.path('email').index({ unique: true });
schema.path('accessToken').index({ unique: true });
schema.path('auth.local.username').index({ unique: true, sparse: true });
schema.path('auth.google.id').index({ unique: true, sparse: true });