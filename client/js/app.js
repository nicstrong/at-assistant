'use strict';

'use strict';

var _ = require('lodash'),
  $ = require('jquery'),
  moment = require('moment'),
  angular = require('angular');

var ngModule = angular.module('app', [
  'ngAnimate',
  'ngCookies',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'restangular',
  'app.shared',
  'app.layout',
  'app.auth',
  'app.main'
]);


// Enable HTML5 Mode.
ngModule.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

//// Set Restangular base URL.
//ngModule.config(function (RestangularProvider) {
//  RestangularProvider
//    .setBaseUrl('/api')
//    .setResponseExtractor(function (res) {
//      return res.result;
//    });
//});

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


// Load user from global variable sent from server.
ngModule.config(function (authProvider) {
  if (_.isPlainObject(global.config) && global.config.user) {
    authProvider.initUser(global.config.user);
  }
});

// Attach variables to $rootScope.
ngModule.run(function ($location, $rootScope, $state, $stateParams, app, auth) {
  _.assign($rootScope, {
    _: _,
    $: $,
    $location: $location,
    $state: $state,
    $stateParams: $stateParams,
    app: app,
    config: app.config,
    moment: moment,
    user: auth.getUser()
  });
});

// Loading spinner.
ngModule.run(function ($rootScope, layout) {
  var commonFunc = function (spinnerFunc, event, toState) {
    if (!toState.resolve || _.isEmpty(toState.resolve)) { return; }
    spinnerFunc();
  };
  $rootScope.$on('$stateChangeStart', _.wrap(layout.startSpinner, commonFunc));
  $rootScope.$on('$stateChangeSuccess', _.wrap(layout.stopSpinner, commonFunc));
  $rootScope.$on('$stateChangeError', _.wrap(layout.stopSpinner, commonFunc));
});
