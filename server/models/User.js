'use strict';

var util = require('util');
var _ = require('lodash'),
  Calendar = require('./Calendar'),
  mongooseFindOrCreate = require('mongoose-findorcreate');


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
    google: {
      id: { type: String },
      token: { type: String },
      profile: { type: mongoose.SchemaTypes.Mixed }
    }
  },
  calendars: [ Calendar.schema ]
});

// Indexes
schema.path('email').index({ unique: true });
schema.path('accessToken').index({ unique: true });
schema.path('auth.google.id').index({ unique: true, sparse: true });

// Virtuals
schema.virtual('safeJSON').get(function () {
  return JSON.stringify(this.getSafeJSON());
});
schema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});
schema.virtual('name.full').set(function (name) {
  this.name.first = name.slice(0, Math.max(1, name.length - 1)).join(' ');
  this.name.last = name.slice(Math.max(1, name.length - 1)).join(' ');
});

// Plugins
schema.plugin(mongooseFindOrCreate);

// Bcrypt middleware
schema.pre('save', function (next) {
  var SALT_WORK_FACTOR = 10,
    user = this;

  if (!user.isModified('auth.local.password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.auth.local.password, salt, function (err, hash) {
      if (err) { return next(err); }
      user.auth.local.password = hash;
      next();
    });
  });
});

// Safe JSON (internal data removed)
schema.methods.getSafeJSON = function () {
  var user = this.toJSON();

  user.id = user._id;
  delete user._id;
  delete user.__v;
  delete user.accessToken;

  if (user.auth.google) {
    delete user.auth.google.token;
  }

  return user;
};

schema.statics.findOrCreateGoogle = function (accessToken, refreshToken, profile, cb) {
  // console.log(profile._json);
  var data = {
    email: profile._json.email,
    name: {
      /* jshint camelcase: false */
      first: profile._json.given_name,
      last: profile._json.family_name
      /* jshint camelcase: true */
    },
    'auth.google': {
      id: profile.id,
      token: accessToken,
      profile: profile._json
    }
  };
  app.models.User.findOneAndUpdate({
    email: data.email
  }, _.omit(data, ['email', 'name']), function (err, user) {
    if (err) { return cb(err); }
    if (user) {
      // Updated existing account.
      return cb(null, user);
    } else {
      // Create new account.
      app.models.User.create(data, cb);
    }
  });
};

// Model
var model = mongoose.model('User', schema);

// Public API
exports = module.exports = model;