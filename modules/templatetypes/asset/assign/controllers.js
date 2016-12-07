'use strict';

angular.module('Home').controller('ModalAssignAssetCtrl',
        function ($scope, $modalInstance, parentScope, HomeService, asset, name, token) {
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
                    HomeService.addLink(token, $scope.link,
                            function (response) {
                                if (response) {
                                    if (response.error_description) {
                                        $scope.error = response.error_description + ". Please logout!";
                                    } else {
                                        if (response.success) {
                                            parentScope.refreshAsset(asset, true);
                                            $modalInstance.close();
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

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
