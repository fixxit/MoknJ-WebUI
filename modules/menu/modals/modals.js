'use strict';

angular.module('Menu').controller('ModalDeleteMenuCtrl',
        function ($scope, $uibModalInstance, parentScope, menu) {
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
                                $uibModalInstance.close();
                            } else {
                                $scope.errorMessage = true;
                                $scope.message = message;
                            }
                        }
                );
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });