'use strict';

angular.module('Home').controller('ModalAssignAssetCtrl',
        function ($scope, $uibModalInstance, parentScope, HomeService, asset, name, token, menuId) {
            $scope.name = 'Check ' + name + " Out";
            $scope.asset = asset;
            $scope.resources = [];
            $scope.selected = 'Select a Employee';
            $scope.resource = {};
            $scope.pagination = {};

            // selected item desplayed in div
            $scope.dropboxitemselected = function (resource) {
                $scope.selected = resource.fullname;
                $scope.resource = resource;
                $scope.resourceCollapse = !$scope.resourceCollapse;
            };

            $scope.loadPage = function () {
                HomeService.all(token,
                        function (response) {
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    if (response.resources) {
                                        // do not refresh the entire structure
                                        $scope.resources = response.resources;

                                        $scope.pagination.viewby = 5;
                                        $scope.pagination.totalItems = $scope.resources.length;
                                        $scope.pagination.currentPage = 1;
                                        $scope.pagination.itemsPerPage = 5;
                                        $scope.pagination.maxSize = 5;

                                        angular.forEach($scope.resources, function (entry) {
                                            entry.fullname = entry.firstName + " " + entry.surname;
                                        });

                                        $scope.dataLoading = false;
                                    } else {
                                        $scope.error = "Invalid server response";
                                    }
                                }
                            } else {
                                $scope.error = "Invalid server response";
                            }
                        }
                );
            };


            // check if even for row odd and even colors
            $scope.isEven = function (value) {
                return parentScope.isEven(value);
            };


            $scope.loadPage();
            $scope.ok = function () {
                if ($scope.auditdate == null) {
                    $scope.showDateIsRequired = true;
                    $scope.error = "Date is required";
                } else {
                    $scope.showDateIsRequired = false;
                    $scope.error = null;
                }

                if ('Select an Resource' === $scope.selected) {
                    $scope.showResourceIsRequired = true;
                    $scope.error = "Employee is required";
                } else {
                    $scope.showResourceIsRequired = false;
                    $scope.error = null;
                }
                if (!$scope.showResourceIsRequired
                        && !$scope.showDateIsRequired) {
                    $scope.dataLoading = true;
                    $scope.link = {
                        'resourceId': $scope.resource.id,
                        'assetId': asset.id,
                        'date': $scope.auditdate,
                        'checked': true
                    };
                    // this setting of the resource is required for refreshAsset
                    // method which is called by the addLink.
                    asset.resourceId = $scope.resource.id;
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
                                            parentScope.refreshAsset(asset, true);
                                            $uibModalInstance.close();
                                        } else {
                                            $scope.message = response.message;
                                        }
                                    }
                                } else {
                                    $scope.error = "Invalid server response";
                                }
                                $scope.dataLoading = false;
                            }
                    );
                }
            };


            $scope.resourceCollapse = false;

            $scope.changeDiv = function () {
                $scope.resourceCollapse = !$scope.resourceCollapse;
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

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });
