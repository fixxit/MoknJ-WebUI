'use strict';
angular.module('EmployeeLink')
        .controller('EmployeeLinkController',
                ['$scope', '$rootScope', '$location', 'EmployeeLinkService',
                    function ($scope, $rootScope, $location, EmployeeLinkService) {
                        var name = $location.search().name;
                        $scope.id = $location.search().id ? $location.search().id : null;
                        $scope.menuId = $location.search().menuId ? $location.search().menuId : null;
                        $scope.origin = $location.search().origin ? $location.search().origin : null;

                        $scope.employeeId = $location.search().employeeId;
                        $scope.resourceId = $location.search().resourceId;
                        $scope.pagination = {};
                        // logic for navigation between pages...
                        $scope.urlScope = {
                            'url': '/home',
                            'return_parms': null
                        };

                        // logic for navigation between pages...
                        $scope.initialiseUrlParms = function () {
                            if ($scope.id) {
                                $scope.urlScope.return_parms = {
                                    'id': $scope.menuId,
                                    'templateId': $scope.id
                                };
                            } else {
                                $scope.urlScope.return_parms = {
                                    'id': $scope.menuId
                                };
                            }
                        };

                        // Execeutes the url
                        $scope.executeURL = function () {
                            $scope.initialiseUrlParms();
                            // execute location change!
                            if (!$scope.urlScope.return_parms) {
                                $location.path($scope.urlScope.url);
                            } else {
                                $location.path($scope.urlScope.url)
                                        .search($scope.urlScope.return_parms);
                            }
                        };

                        $scope.loadPage = function () {
                            $scope.loading = true;
                            if (name) {
                                $scope.name = 'Audit Trail ' + name;
                            } else {
                                $scope.name = "Employee Audit Trail";
                            }

                            if ($scope.employeeId) {
                                $scope.getEmployeeLinksByEmployeeId($scope.employeeId);
                            } else {
                                $scope.allEmployeeLink();
                            }

                            $scope.loading = false;
                        };

                        $scope.getEmployeeLinksByEmployeeId = function (employeeId) {
                            EmployeeLinkService.allEmployeeLinksForEmployeeId(
                                    $rootScope.globals.currentUser.access_token,
                                    employeeId,
                                    $scope.process
                                    );
                        };

                        $scope.allEmployeeLink = function () {
                            EmployeeLinkService.allEmployeeLink(
                                    $rootScope.globals.currentUser.access_token,
                                    $scope.process
                                    );
                        };

                        $scope.process = function (response) {
                            if (response) {
                                if (response.error_description) {
                                    if ("Access is denied" !== response.error_description) {
                                        $scope.error = response.error_description + ". Please logout!";
                                    }
                                } else {
                                    $scope.employeeLinks = response.employeeLinks;
                                    if ($scope.employeeLinks) {
                                        $scope.pagination.viewby = 10;
                                        $scope.pagination.totalItems = $scope.employeeLinks.length;
                                        $scope.pagination.currentPage = 1;
                                        $scope.pagination.itemsPerPage = 10;
                                        $scope.pagination.maxSize = 10;
                                    }
                                }
                            } else {
                                $scope.error = "Invalid server response";
                            }
                        };

                        $scope.loadPage();
                    }]);