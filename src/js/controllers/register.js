'use strict';

app.controller('RegisterCtrl', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {

  // This object will be filled by the form
  $scope.user = {};

  $scope.register = function() {
    $scope.usernameError = null;
    $scope.registerError = null;
    $http.post('/register', {
      email: $scope.user.email,
      password: $scope.user.password,
      confirmPassword: $scope.user.confirmPassword,
      username: $scope.user.username,
      name: $scope.user.name
    })
    .success(function() {
      // authentication OK
      $scope.registerError = 0;
      $rootScope.user = $scope.user;
      $rootScope.$emit('loggedin');
      $location.url('/');
    })
    .error(function(error) {
      // Error: authentication failed
      if (error === 'Username already taken') {
        $scope.usernameError = error;
      } else if (error === 'Email already taken') {
        $scope.emailError = error;
      } else $scope.registerError = error;
    });
  };

}]);
