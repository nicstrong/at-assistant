'use strict';

'use strict';

var _ = require('lodash'),
  $ = require('jquery'),
  angular = require('angular');

var ngModule = angular.module('app', [
  'ngAnimate',
  'ngCookies',
  'ngSanitize',

  'ui.router',
  'restangular'
]);


// Enable HTML5 Mode.
ngModule.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

// Set Restangular base URL.
ngModule.config(function (RestangularProvider) {
  RestangularProvider
    .setBaseUrl('/api')
    .setResponseExtractor(function (res) {
      return res.result;
    });
});

ngModule.config(function ($stateProvider, $urlRouterProvider, layoutProvider) {
  $stateProvider
    .state('express', {
      url: '*path',
      views: layoutProvider.getViews(),
      onEnter: function () {
        if (_.isPlainObject(global.config) && !!global.config.catchAll) {
          global.location.replace('/404.html');
        }
      }
    });
});
