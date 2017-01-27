'use strict';

angular.module('Home').controller('ModalRemoveLinkCtrl',
        function ($scope, $modalInstance, parentScope, HomeService, asset, name, token, menuId) {
            $scope.name = 'Check ' + name + " In";

            $scope.ok = function () {
                $scope.dataLoading = true;
                $scope.link = {
                    'resourceId': asset.resourceId,
                    'assetId': asset.id,
                    'date': $scope.auditdate,
                    'checked': false
                };

                HomeService.addLink(
                        token,
                        $scope.link,
                        menuId,
                        asset.typeId,
                        function (response) {
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    if (response.success) {
                                        parentScope.refreshAsset(asset, false);
                                        $modalInstance.close();
                                    } else {
                                        $scope.message = response.message;
                                    }
                                }
                            } else {
                                $scope.error = "Invalid server response";
                            }
                        }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.openDatePickers = [];
            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return (mode === 'day'
                        && (date.getDay() === 0
                                || date.getDay() === 6));
            };

            $scope.openDate = function ($event, datePickerIndex) {
                $event.preventDefault();
                $event.stopPropagation();

                if ($scope.openDatePickers[datePickerIndex] === true) {
                    $scope.openDatePickers.length = 0;
                } else {
                    $scope.openDatePickers.length = 0;
                    $scope.openDatePickers[datePickerIndex] = true;
                }
            };
        });