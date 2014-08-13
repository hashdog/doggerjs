'use strict';

app.controller('LoginCtrl', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {

  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.login = function() {
    $http.post('/api/login', {
      email: $scope.user.email,
      password: $scope.user.password
    })
    .success(function(response) {
      console.log(12343);
      // authentication OK
      $scope.loginError = false;
      $rootScope.user = response.user;
      $rootScope.$emit('loggedin');
      if (response.redirect) {
        if (window.location.href === response.redirect) {
          //This is so an admin user will get full admin page
          window.location.reload();
        } else {
          window.location = response.redirect;
        }
      } else {
        $location.url('/');
      }
    })
    .error(function() {
      console.log(123);
      $scope.loginError = 'Authentication failed.';
    });
  };

}]);
