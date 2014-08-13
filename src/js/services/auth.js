'use strict';

app.factory('Auth', ['$http', '$location', '$rootScope', '$cookieStore', function($http, $location, $rootScope, $cookieStore) {

  $rootScope.currentUser = $cookieStore.get('user');
  $cookieStore.remove('user');

  return {
    login: function(user) {
      return $http.post('/api/login')
        .success(function(data) {
          $rootScope.currentUser = data;
          $location.path('/');

          // TODO: Add alert "You have successfully logged in."
        })
        .error(function() {
          // TODO: Add error alert "Invalid username or password."
          $location.path('/');
        });
    },
    logout: function() {
      return $http.get('/api/logout')
        .success(function() {
          $rootScope.currentUser = null;
          $cookieStore.remove('user');
        });
    }
  };
}]);
