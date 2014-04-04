'use strict';

exports = module.exports = function (ngModule) {
  ngModule.controller('HomeCtrl', function ($scope, features) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
};