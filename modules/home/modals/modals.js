'use strict';

angular.module('Home').controller('ModalDeleteTypeCtrl',
        function ($scope, $modalInstance, parentScope, type, token) {
            $scope.name = type.name;
            $scope.cascade = false;

            $scope.ok = function () {
                $scope.dataLoading = true;
                parentScope.deleteTemplate(type.id, $scope.cascade, token,
                        function () {
                            parentScope.loadPage();
                            $modalInstance.close();
                        }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });