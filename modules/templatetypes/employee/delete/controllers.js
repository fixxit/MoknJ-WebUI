'use strict';

angular.module('Home').controller('ModalDeleteEmployeeCtrl',
        function ($scope, $uibModalInstance, parentScope, HomeService,
                employee, name, token, typeId, menuId) {
            $scope.name = name;
            $scope.message = "Are you sure you want to delete this record ?";

            $scope.ok = function () {
                HomeService.deleteEmployee(
                        token,
                        menuId,
                        employee,
                        function (response) {
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    if (response.success) {
                                        parentScope.removeEmployeeFromTemplate(typeId, employee);
                                    } else {
                                        parentScope.removeEmployeeFromTemplate(typeId, employee, response.message);
                                    }
                                }
                            } else {
                                $scope.error = "Invalid server response";
                            }
                        }
                );
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });