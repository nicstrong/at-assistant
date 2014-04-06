/*
 * client/js/layout/controllers/_nav.js
 */

'use strict';

var _ = require('lodash');

var _o;

function login() {
  _o.auth.login();
}

function logout() {
  _o.layout.startSpinner();
  _o.auth.logout().finally(_o.layout.stopSpinner);
}


exports = module.exports = function (ngModule) {
  ngModule.controller('_NavCtrl', function ($location, $scope, $state, auth, layout) {
    _o = {
      $location: $location,
      $scope: $scope,
      $state: $state,
      auth: auth,
      layout: layout
    };

    _.assign($scope, {
      login: login,
      logout: logout
    });
  });
};
