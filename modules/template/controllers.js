'use strict';

angular.module('Template')
        .controller('TemplateController',
                ['$scope', '$rootScope', 'TypeService', '$modal',
                    function ($scope, $rootScope, TypeService, $modal) {
                        $scope.pagination = {};
 
                        $scope.loadPage = function () {
                            $scope.loading = true;
                            TypeService.hidden($rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                if ("Access is denied" !== response.error_description) {
                                                    $scope.error = response.error_description + ". Please logout!";
                                                }
                                            } else {
                                                if (response.types) {
                                                    // do not refresh the entire structure
                                                    $scope.types = response.types;
                                                    $scope.pagination.viewby = 5;
                                                    $scope.pagination.totalItems = response.types.length;
                                                    $scope.pagination.currentPage = 1;
                                                    $scope.pagination.itemsPerPage = 5;
                                                    $scope.pagination.maxSize = 5;                                                 
                                                } else {
                                                    $scope.error = "Invalid server response";
                                                }
                                            }
                                        } else {
                                            $scope.error = "Invalid server response";
                                        }
                                        $scope.loading = false;
                                    }
                            );
                        };

                        // check if even for row odd and even colors
                        $scope.isEven = function (value) {
                            if (value % 2 === 0) {
                                return "";//"info";
                            } else {
                                return "active";
                            }
                        };

                        $scope.deleteTemplete = function (type) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/template/templates/deletetemplate.html',
                                controller: 'ModalDeleteTemplateCtrl',
                                resolve: {
                                    parentScope: function () {
                                        return $scope;
                                    },
                                    type: function () {
                                        return type;
                                    }
                                }
                            });
                        };

                        $scope.unhideTemplate = function (type) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/template/templates/unhidetemplate.html',
                                controller: 'ModalUnhideTemplateCtrl',
                                resolve: {
                                    parentScope: function () {
                                        return $scope;
                                    },
                                    type: function () {
                                        return type;
                                    }
                                }
                            });
                        };

                        $scope.unhide = function (type, callback) {
                            TypeService.unhide(
                                    $rootScope.globals.currentUser.access_token,
                                    type.id,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                callback(response.success, response.message);
                                            }
                                        } else {
                                            $scope.error = "Invalid server response";
                                        }
                                    }
                            );
                        };
                        
                        
                        $scope.delete = function (type, callback) {
                            TypeService.delete(
                                    $rootScope.globals.currentUser.access_token,
                                    type.id,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                callback(response.success, response.message);
                                            }
                                        } else {
                                            $scope.error = "Invalid server response";
                                        }
                                    }
                            );
                        };             

                        $scope.loadPage();
                    }]);

angular.module('Template').controller('ModalDeleteTemplateCtrl',
        function ($scope, $modalInstance, parentScope, type) {
            $scope.name = type.name;
            $scope.accept = false;
            $scope.errorMessage = false;
            $scope.message = '';

            $scope.ok = function () {
                $scope.errorMessage = false;
                $scope.dataLoading = true;
                parentScope.delete(type, function (success, message) {
                    if (success) {
                        $modalInstance.close();
                        parentScope.loadPage();
                    } else {
                        $scope.error = message;
                         //$scope.error = "Could not un-hide template, internal error!";
                    }
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });


angular.module('Template').controller('ModalUnhideTemplateCtrl',
        function ($scope, $modalInstance, parentScope, type) {
            $scope.name = type.name;
            $scope.accept = false;
            $scope.errorMessage = false;
            $scope.message = '';

            $scope.ok = function () {
                $scope.errorMessage = false;
                $scope.dataLoading = true;
                parentScope.unhide(type, function (success, message) {
                    if (success) {
                        $modalInstance.close();
                        parentScope.loadPage();
                    } else {
                        $scope.error = message;
                         //$scope.error = "Could not un-hide template, internal error!";
                    }
                });

            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

