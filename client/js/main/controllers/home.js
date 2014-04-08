'use strict';

var _o;

exports = module.exports = function (ngModule) {
  ngModule.controller('HomeCtrl', function ($scope, Restangular) {

    _o = {
      $scope: $scope,
      Restangular: Restangular
    };

    $scope.awesomeThings = [
      'Node.js',
      'AngularJS',
      'Browserify',
      'Grunt'
    ];

  });
};