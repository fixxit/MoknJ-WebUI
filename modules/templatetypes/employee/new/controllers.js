'use strict';

angular.module('Employee')
        .controller('EmployeeController',
                ['$scope', '$rootScope', '$location', 'EmployeeService',
                    function ($scope, $rootScope, $location, EmployeeService) {
                        var id = $location.search().id;
                        $scope.menuId = $location.search().menuId ? $location.search().menuId : null;
                        $scope.employeeId = $location.search().employeeId ? $location.search().employeeId : null;
                        $scope.resourceId = $location.search().resourceId ? $location.search().resourceId : null;
                        $scope.name = '';
                        $scope.resources = [];
                        $scope.selected = 'Select a Employee';
                        $scope.resource = null;
                        $scope.pagination = {};
                        $scope.resourceCollapse = false;
                        $scope.id = id;

                        $scope.loadPage = function (id) {
                            $scope.getAllResources();
                            if (id) {
                                EmployeeService.getDetail($rootScope.globals.currentUser.access_token, id,
                                        function (response) {
                                            if (response) {
                                                if (response.error_description) {
                                                    if ("Access is denied" !== response.error_description) {
                                                        $scope.error = response.error_description + ". Please logout!";
                                                    }
                                                } else {
                                                    if (response.type) {
                                                        $scope.type = response.type;

                                                        if ($scope.resourceId) {
                                                            $scope.type.resourceId = $scope.resourceId;
                                                        }

                                                        angular.forEach($scope.type.details, function (detail) {
                                                            if (detail.type === 'GBL_INPUT_DRP_TYPE') {
                                                                var n = detail.name.indexOf(":");
                                                                var name = detail.name.substring(0, n);
                                                                var json = detail.name.substring(n + 1, detail.name.length);
                                                                detail.name = name;
                                                                detail.dropdownvalues = JSON.parse(json);
                                                                detail.value = 'no selection';
                                                            }
                                                        });

                                                        $scope.name = $scope.type.name;
                                                        if ($scope.employeeId) {
                                                            EmployeeService.get($rootScope.globals.currentUser.access_token, $scope.employeeId,
                                                                    function (response) {
                                                                        if (response) {
                                                                            if (response.error_description) {
                                                                                $scope.error = response.error_description + ". Please logout!";
                                                                            } else {
                                                                                if (response.employee) {
                                                                                    $scope.employee = response.employee;
                                                                                    angular.forEach($scope.employee.details, function (employee) {
                                                                                        angular.forEach($scope.type.details, function (detail) {
                                                                                            if (detail.id === employee.id) {
                                                                                                detail.value = employee.value;
                                                                                            }
                                                                                        });
                                                                                    });

                                                                                    $scope.type.resourceId = response.employee.resourceId;
                                                                                    $scope.type.menuScopeIds = response.employee.menuScopeIds;
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

                        // selected item desplayed in div
                        $scope.dropboxResourceSelected = function (resource) {
                            $scope.selected = resource.fullname;
                            $scope.resource = resource;
                            $scope.resourceCollapse = !$scope.resourceCollapse;
                        };


                        $scope.changeDiv = function () {
                            $scope.resourceCollapse = !$scope.resourceCollapse;
                        };

                        $scope.getAllResources = function () {
                            EmployeeService.allResources($rootScope.globals.currentUser.access_token,
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
                        }

                        $scope.dropboxitemselected = function (item, detail) {
                            detail.value = item;
                        };

                        $scope.openDatePickers = [];

                        // Disable weekend selection
                        $scope.disabled = function (date, mode) {
                            return (mode === 'day'
                                    && (date.getDay() === 0
                                            || date.getDay() === 6));
                        };

                        $scope.openCal = function ($event, datePickerIndex) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            if ($scope.openDatePickers[datePickerIndex] === true) {
                                $scope.openDatePickers.length = 0;
                            } else {
                                $scope.openDatePickers.length = 0;
                                $scope.openDatePickers[datePickerIndex] = true;
                            }
                        };

                        $scope.stripTrailing = function (str, trimStr) {
                            if (str.substr(0, 1) === trimStr) {
                                str = str.substring(1);
                            }
                            var len = str.length;
                            if (str.substr(len - 1, 1) === trimStr) {
                                str = str.substring(0, len - 1);
                            }
                            return str;
                        };

                        $scope.save = function () {
                            if (id) {
                                if (!$scope.employeeId) {
                                    $scope.type.id = null;
                                } else {
                                    $scope.type.id = $scope.employeeId;
                                }

                                if (!$scope.type.menuScopeIds) {
                                    $scope.type.menuScopeIds = [$scope.menuId];
                                }

                                var missingValue = '';
                                angular.forEach($scope.type.details, function (detail) {
                                    if (detail.mandatory && (!detail
                                            || detail.value === ''
                                            || detail.value === 'no selection')) {
                                        missingValue = missingValue + detail.name + ',';
                                    }
                                });

                                if ($scope.resource) {
                                    $scope.type.resourceId = $scope.resource.id;
                                } else {
                                    if (!$scope.type.resourceId) {
                                        missingValue = missingValue + "employee,";
                                    }
                                }

                                if (missingValue) {
                                    missingValue = $scope.stripTrailing(missingValue, ',');
                                }

                                if (!missingValue) {
                                    EmployeeService.save(
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
                                                    // employee type success or error
                                                    if (response.success === true) {
                                                        //success
                                                        if (!$scope.employeeId) {
                                                            $scope.success = 'Successfully saved employee, save new employee ?';
                                                        } else {
                                                            if ($scope.menuId) {
                                                                $location.path('/home').search(
                                                                        {
                                                                            'id': $scope.menuId,
                                                                            'templateId': $scope.id,
                                                                            'resourceId': $scope.type.resourceId
                                                                        }
                                                                );
                                                            } else {
                                                                $location.path('/home');
                                                            }
                                                        }

                                                        $scope.error = null;
                                                        $scope.dataLoading = false;
                                                        // Reset all data
                                                        $scope.reset(false);
                                                    } else {
                                                        // error 
                                                        if (!$scope.resourceId) {
                                                            $scope.type.resourceId = null;
                                                        }
                                                        $scope.success = null;
                                                        $scope.error = response.message;
                                                    }
                                                }
                                            }
                                    );
                                } else {
                                    $scope.error = 'Please provide values for ' + missingValue;
                                }
                            }
                        };

                        $scope.reset = function (clear) {
                            $scope.error = null;
                            if (clear) {
                                $scope.success = null;
                            }

                            if ($scope.resourceId) {
                                $scope.type.resourceId = $scope.resourceId;
                            } else {
                                $scope.type.resourceId = null;
                                $scope.selected = 'Select a Employee';
                                $scope.resource = null;
                            }

                            angular.forEach($scope.type.details, function (detail) {
                                detail.value = null;
                                if (detail.type === 'GBL_INPUT_DRP_TYPE') {
                                    detail.value = 'no selection';
                                }
                            });
                        };


                        $scope.loadPage(id);
                    }]);

