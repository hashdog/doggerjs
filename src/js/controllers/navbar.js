'use strict';

app.controller('NavbarCtrl', ['$scope', 'Auth', function($scope, Auth) {
  $scope.name = 'DoggerJS';

  $scope.logout = function() {
    Auth.logout();
  };
}]);
