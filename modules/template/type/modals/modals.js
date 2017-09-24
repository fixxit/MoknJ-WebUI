angular.module('Type').controller('ModalDeleteTypeCtrl',
        function ($scope, $uibModalInstance, parentScope, type, token) {
            $scope.name = type.name;
            $scope.cascade = false;

            $scope.ok = function () {
                $scope.dataLoading = true;
                parentScope.deleteTemplate(type.id, $scope.cascade, token,
                        function () {
                            parentScope.loadPage();
                            $uibModalInstance.close();
                        }
                );
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });