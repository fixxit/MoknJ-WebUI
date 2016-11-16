'use strict';

angular.module('Asset')
        .controller('AssetController',
                ['$scope', '$rootScope', '$location', 'AssetService',
                    function ($scope, $rootScope, $location, AssetService) {
                        $scope.assetId = $location.search().assetId;
                        var id = $location.search().id;

                        $scope.loadPage = function (id) {
                            if (id) {
                                AssetService.getDetail($rootScope.globals.currentUser.access_token, id,
                                        function (response) {
                                            if (response) {
                                                if (response.error_description) {
                                                    $scope.error = response.error_description + ". Please logout!";
                                                } else {
                                                    if (response.type) {
                                                        $scope.type = response.type;
                                                        if ($scope.assetId) {
                                                            AssetService.get($rootScope.globals.currentUser.access_token, $scope.assetId,
                                                                    function (response) {
                                                                        if (response) {
                                                                            if (response.error_description) {
                                                                                $scope.error = response.error_description + ". Please logout!";
                                                                            } else {
                                                                                if (response.asset) {
                                                                                    $scope.asset = response.asset;
                                                                                    angular.forEach($scope.asset.details, function (asset) {
                                                                                        angular.forEach($scope.type.details, function (detail) {
                                                                                            if (detail.id === asset.id) {
                                                                                                detail.value = asset.value;
                                                                                            }
                                                                                        });
                                                                                    });
                                                                                    $scope.type.resourceId = response.asset.resourceId;
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
                        };


                        $scope.loadPage(id);

                        $scope.openDatePickers = [];

                        // Disable weekend selection
                        $scope.disabled = function (date, mode) {
                            return (mode === 'day'
                                    && (date.getDay() === 0
                                            || date.getDay() === 6));
                        };

                        $scope.required = function (required) {
                            if (required) {
                                return true;
                            } else {
                                return false;
                            }
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
                                if (!$scope.assetId) {
                                    $scope.type.id = null;
                                } else {
                                    $scope.type.id = $scope.assetId;
                                }

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
                                                    if (!$scope.assetId) {
                                                        $scope.success = 'Successfully saved asset, save new asset ?';
                                                    } else {
                                                        $location.path('/home');
                                                    }

                                                    $scope.error = null;
                                                    $scope.dataLoading = false;
                                                    // Reset all data
                                                    $scope.reset(false);
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

                        $scope.reset = function (clear) {
                            $scope.error = null;
                            if (clear) {
                                $scope.success = null;
                            }
                            angular.forEach($scope.type.details, function (detail) {
                                detail.value = null;
                            });
                        };
                    }]);

angular.module('Asset').directive('number', function () {
    return {
        link: function (scope, el, attr) {
            el.bind("keydown keypress", function (event) {
                if (event.keyCode === 8
                        || event.keyCode === 13
                        || event.keyCode === 46
                        || event.keyCode === 99
                        || event.keyCode === 118
                        || event.keyCode === 190) {
                    return;
                } else {
                    if ((event.keyCode < 48
                            || event.keyCode > 57)) {
                        event.preventDefault();
                    }
                }
            });
        }
    };
});

angular.module('Asset').directive('numberonly', function () {
    return {
        link: function (scope, el, attr) {
            el.bind("keydown keypress", function (event) {
                if (event.keyCode === 8
                        || event.keyCode === 13
                        || event.keyCode === 46
                        || event.keyCode === 99
                        || event.keyCode === 118
                        ) {
                    return;
                }
                if ((event.keyCode < 48
                        || event.keyCode > 57)) {
                    event.preventDefault();
                }
            });
        }
    };
});