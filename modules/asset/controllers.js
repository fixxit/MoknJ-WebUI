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
                                                    if ("Access is denied" !== response.error_description) {
                                                        $scope.error = response.error_description + ". Please logout!";
                                                    }
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
                                                if ("Access is denied" !== response.error_description) {
                                                    $scope.error = response.error_description + ". Please logout!";
                                                } else {
                                                     $scope.error = response.error_description + ". Please contact your administrator.";
                                                }
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

angular.module('Asset').directive('moneyOnlyInput', function () {
    return {
        restrict: 'EA',
        template: '<input name="{{inputName}}" ng-model="inputValue" class="form-control" />',
        scope: {
            inputValue: '=',
            inputName: '='
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (newValue) {
                    var arr = String(newValue).split("");
                    if (arr.length === 0)
                        return;
                    if (arr.length === 1 && (arr[0] === '-' || arr[0] === '.'))
                        return;
                    if (arr.length === 2 && newValue === '-.')
                        return;
                    if (isNaN(newValue)) {
                        if (oldValue) {
                            scope.inputValue = oldValue;
                        } else {
                            scope.inputValue = '';
                        }
                    }
                }
            });
        }
    };
});

angular.module('Asset').directive('moneyOnlyInputRequired', function () {
    return {
        restrict: 'EA',
        template: '<input name="{{inputName}}" ng-model="inputValue" class="form-control" required />',
        scope: {
            inputValue: '=',
            inputName: '='
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (newValue) {
                    var arr = String(newValue).split("");
                    if (arr.length === 0)
                        return;
                    if (arr.length === 1 && (arr[0] === '-' || arr[0] === '.'))
                        return;
                    if (arr.length === 2 && newValue === '-.')
                        return;
                    if (isNaN(newValue)) {
                        if (oldValue) {
                            scope.inputValue = oldValue;
                        } else {
                            scope.inputValue = '';
                        }
                    }
                }
            });
        }
    };
});


angular.module('Asset').directive('numberOnlyInput', function () {
    return {
        restrict: 'EA',
        template: '<input name="{{inputName}}" ng-model="inputValue" class="form-control" />',
        scope: {
            inputValue: '=',
            inputName: '='
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (newValue) {
                    var arr = String(newValue).split("");
                    if (arr.length === 0) {
                        return;
                    } else if (arr.length === 1 && (arr[0] === '-' || arr[0] === '.')) {
                        return;
                    } else if (arr.length === 2 && newValue === '-.') {
                        return;
                    } else {
                        if (isNaN(newValue)) {
                            if (oldValue) {
                                scope.inputValue = oldValue;
                            } else {
                                scope.inputValue = '';
                            }
                        } else {
                            scope.inputValue = parseInt(Number(newValue));
                        }
                    }
                }
            });
        }
    };
});

angular.module('Asset').directive('numberOnlyInputRequired', function () {
    return {
        restrict: 'EA',
        template: '<input name="{{inputName}}" ng-model="inputValue" class="form-control" required/>',
        scope: {
            inputValue: '=',
            inputName: '='
        },
        link: function (scope) {
            scope.$watch('inputValue', function (newValue, oldValue) {
                if (newValue) {
                    var arr = String(newValue).split("");
                    if (arr.length === 0) {
                        return;
                    } else if (arr.length === 1 && (arr[0] === '-' || arr[0] === '.')) {
                        return;
                    } else if (arr.length === 2 && newValue === '-.') {
                        return;
                    } else {
                        if (isNaN(newValue)) {
                            if (oldValue) {
                                scope.inputValue = oldValue;
                            } else {
                                scope.inputValue = '';
                            }
                        } else {
                            scope.inputValue = parseInt(Number(newValue));
                        }
                    }
                }
            });
        }
    };
});

