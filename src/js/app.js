'use strict';

// Change appName using your own app name
var app = angular.module('doggerApp', [
  'ngRoute',
  'ngResource',
  'ngCookies',
  'templates'
]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html'
    })
    .when('/login', {
      templateUrl: 'views/login.html'
    })
    .when('/register', {
      templateUrl: 'views/register.html'
    })
    .when('/forgot', {
      templateUrl: 'views/forgot-password.html'
    })
    .when('/reset', {
      templateUrl: 'views/reset-password.html'
    })
    .when('/404', {
      templateUrl: 'views/404.html'
    })
    .otherwise({ redirectTo: '/' });

  // Set HTML5 mode
  $locationProvider.html5Mode(true);
}]);
