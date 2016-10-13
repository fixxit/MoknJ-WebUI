
'use strict';
angular.module('myBoot', ['ui.bootstrap'])
.controller('NavbarController', ['$scope', function($scope){
  $scope.isCollapsed = true;
  $scope.name = "FiXXit"
}]);