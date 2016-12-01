'use strict';

angular.module('Menu').controller('ModalDeleteMenuCtrl',
        function ($scope, $modalInstance, parentScope, menu) {
            $scope.name = menu.name;
            $scope.accept = false;
            $scope.errorMessage = false;
            $scope.message = '';

            $scope.ok = function () {
                $scope.errorMessage = false;
                $scope.dataLoading = true;
                parentScope.deleteMenu(menu,
                        function (success, message) {
                            if (success) {
                                parentScope.removeFromList(menu);
                                $modalInstance.close();
                            } else {
                                $scope.errorMessage = true;
                                $scope.message = message;
                            }
                        }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });