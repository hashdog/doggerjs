'use strict';

app.controller('ForgotPasswordCtrl', ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {

  // This object will be filled by the form
  $scope.user = {};

  $scope.forgotpassword = function() {
    $http.post('/api/forgot-password', { text: $scope.text })
      .success(function(response) {
        $scope.response = response;
      })
      .error(function(error) {
        $scope.response = error;
      });
  };

}]);
