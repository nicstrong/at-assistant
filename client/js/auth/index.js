/*
 * client/js/auth/index.js
 */

'use strict';

var angular = require('angular'),
  rhtml = require('rhtml');

var ngModule = angular.module('app.auth', []);

// Controllers
require('./controllers/login')(ngModule);

// Services
require('./services/auth')(ngModule);

// Routes (s: $state, sp: $stateParams)
ngModule.config(function ($stateProvider) {
  $stateProvider
    .state('app.login', {
      url: '/login?s&sp',
      views: {
        '@': {
          controller: 'LoginCtrl',
          template: rhtml('./templates/login.html')
        }
      }
    });
});

// Redirections
ngModule.run(function (route) {
  route.redirect({
    '/_=_': {
      state: 'app.account.summary',
      reload: true
    }
  });
});

// Authorizations
ngModule.run(function (auth) {
  auth.authorize({
    'app.login': {
      deny: ['user'],
      redirect: 'app.account.summary'
    }
  });
});
