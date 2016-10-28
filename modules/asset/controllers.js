'use strict';

angular.module('Asset')
        .controller('AssetController',
                ['$scope', '$rootScope', '$location', 'AssetService',
                    function ($scope, $rootScope, $location, AssetService) {

                        var id = $location.search().id;
                        if (id) {
                            AssetService.getDetail($rootScope.globals.currentUser.access_token, id,
                                    function (response) {
                                        console.log("reset response : " + JSON.stringify(response.type));
                                        if (response) {
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                if (response.type) {
                                                    $scope.type = response.type;
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
                        }

                        $scope.openDatePickers = [];

                        // Disable weekend selection
                        $scope.disabled = function (date, mode) {
                            return (mode === 'day'
                                    && (date.getDay() === 0
                                            || date.getDay() === 6));
                        };


                        $scope.open = function ($event, datePickerIndex) {
                            $event.preventDefault();
                            $event.stopPropagation();

                            if ($scope.openDatePickers[datePickerIndex] === true) {
                                $scope.openDatePickers.length = 0;
                            } else {
                                $scope.openDatePickers.length = 0;
                                $scope.openDatePickers[datePickerIndex] = true;
                            }
                        };

                        $scope.save = function () {
                            if (id) {
                                $scope.type.id = null;
                                AssetService.save(
                                        $rootScope.globals.currentUser.access_token,
                                        id,
                                        $scope.type,
                                        function (response) {
                                            // token auth error
                                            if (response.error_description) {
                                                $scope.success = null;
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                // asset type success or error
                                                if (response.success === true) {
                                                    //success
                                                    $scope.success = 'Successfully saved a new asset, save new asset ?';
                                                    $scope.error = null;
                                                    $scope.dataLoading = false;
                                                    // Reset all data
                                                    $scope.reset();
                                                } else {
                                                    // error 
                                                    $scope.success = null;
                                                    $scope.error = response.message;
                                                }
                                            }
                                        }
                                );
                            }
                        };

                        $scope.reset = function () {
                            angular.forEach($scope.type.details, function (value) {
                                console.log(JSON.stringify(value));
                            });
                        };
                    }]);