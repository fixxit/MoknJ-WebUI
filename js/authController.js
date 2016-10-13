
'use strict';
angular.module('auth')
.controller('AuthController', ['$scope', function($scope){
  $scope.isCollapsed = true;
  $scope.refresh_token = '';
  $scope.access_token = '';
}]);