'use strict';

angular.module('Home').controller('ModalRemoveLinkCtrl',
        function ($scope, $uibModalInstance, parentScope, HomeService, asset, name, token, menuId) {
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
                                        $uibModalInstance.close();
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

            function getDayClass(data) {
                var date = data.date,
                        mode = data.mode;
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }
                return '';
            }

            // Disable weekend selection
            function disabled(data) {
                var date = data.date,
                        mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }


            $scope.inlineOptions = {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            };

            $scope.dateOptions = {
                dateDisabled: disabled,
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.toggleMin = function () {
                $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
            };

            $scope.toggleMin();

            $scope.popup = {
                opened: false
            };

            $scope.open = function () {
                $scope.popup.opened = true;
            };
        });