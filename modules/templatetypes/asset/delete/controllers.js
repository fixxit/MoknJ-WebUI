'use strict';

angular.module('Home').controller('ModalDeleteAssetCtrl',
        function ($scope, $modalInstance, parentScope, HomeService,
                asset, name, token, typeId, menuId) {
            $scope.name = name;
            $scope.message = "Are you sure you want to delete this asset ?";

            $scope.ok = function () {
                HomeService.deleteAsset(
                        token,
                        menuId,
                        asset,
                        function (response) {
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    if (response.success) {
                                        parentScope.removeAssetFromTemplate(typeId, asset);
                                    } else {
                                        $scope.message = response.message;
                                    }
                                }
                            } else {
                                $scope.error = "Invalid server response";
                            }
                        }
                );
                $modalInstance.close();
            };


            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });