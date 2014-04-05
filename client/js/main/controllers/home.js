'use strict';

exports = module.exports = function (ngModule) {
  ngModule.controller('HomeCtrl', function ($scope, features) {
    $scope.awesomeThings = [
      'Node.js',
      'AngularJS',
      'Browserify',
      'Grunt'
    ];
  });
};