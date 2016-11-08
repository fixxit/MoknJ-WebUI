'use strict';

angular.module('Resource')
        .controller('ResourceController',
                ['$scope', '$rootScope', '$location', 'ResourceService', '$modal',
                    function ($scope, $rootScope, $location, ResourceService, $modal) {
                        $scope.isCollapsed = false;
                        $scope.containerCollapsed = false;
                        $scope.resourceId = $location.search().resourceId;
                        $scope.resource = {};
                        $scope.pagination = {};
                        if ($scope.resourceId) {
                            $scope.resource.id = resourceId;
                        }

                        $scope.loadPage = function (id) {
                            if (id) {
                                $scope.editResource(id);
                            }

                            ResourceService.all($rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                if (response.resources) {
                                                    // do not refresh the entire structure
                                                    $scope.resources = response.resources;
                                                    $scope.pagination.viewby = 5;
                                                    $scope.pagination.totalItems = response.resources.length;
                                                    $scope.pagination.currentPage = 1;
                                                    $scope.pagination.itemsPerPage = 5;
                                                    $scope.pagination.maxSize = 5;
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

                        $scope.save = function () {
                            ResourceService.save(
                                    $rootScope.globals.currentUser.access_token,
                                    $scope.resource,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.success = null;
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            // asset type success or error
                                            if (response.success === true) {
                                                //success
                                                if (!$scope.resourceId) {
                                                    $scope.success = 'Successfully saved a new employee [' + response.resource.id + '], save new resource ?';
                                                } else {
                                                    $scope.success = 'Successfully update employee [' + response.resource.id + ']';
                                                }
                                                $scope.loadPage();

                                                $scope.dataLoading = false;
                                                // Reset all data
                                                $scope.reset();
                                                $scope.resourceId = null;
                                            } else {
                                                // error 
                                                $scope.success = null;
                                                $scope.error = response.message;
                                            }
                                        }
                                    }
                            );
                        };

                        // check if even for row odd and even colors
                        $scope.isEven = function (value) {
                            if (value % 2 === 0) {
                                return "success";
                            } else {
                                return "active";
                            }
                        };


                        $scope.isSystemUser = function (value) {
                            if (value) {
                                return "glyphicon glyphicon-ok";
                            } else {
                                return "glyphicon glyphicon-remove";
                            }
                        };

                        $scope.reset = function (messages) {
                            $scope.resource = {};
                            if (messages) {
                                $scope.success = null;
                                $scope.error = null;
                            }
                        };

                        $scope.cancel = function () {
                            $scope.resourceId = null;
                            $scope.reset();
                            $scope.success = null;
                            $scope.error = null;
                        };

                        $scope.deletResource = function (resource, callback) {
                            ResourceService.remove(
                                    $rootScope.globals.currentUser.access_token,
                                    resource.id,
                                    function (response) {
                                        if (response.error_description) {
                                            callback(false, response.error_description);
                                        } else {
                                            callback(true);
                                        }
                                    }
                            );
                        };

                        $scope.editResource = function (id) {
                            $scope.resourceId = id;
                            ResourceService.get(
                                    $rootScope.globals.currentUser.access_token,
                                    id,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.success = null;
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            // asset type success or error
                                            $scope.resource = response.resource;
                                            $scope.newCollapse = true;
                                        }
                                    }
                            );
                        };

                        $scope.loadPage($scope.resourceId);

                        $scope.removeResource = function (resource) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/resource/templates/deleteresource.html',
                                controller: 'ModalDeleteResourceCtrl',
                                resolve: {
                                    parentScope: function () {
                                        return $scope;
                                    },
                                    resource: function () {
                                        return resource;
                                    }
                                }
                            });
                        };
                        
                        // remove item by index from items
                        $scope.removeFromList = function (resource) {
                            var index = $scope.resources.indexOf(resource);
                            $scope.resources.splice(index, 1);
                        };

                    }]);

angular.module('Resource').controller('ModalDeleteResourceCtrl',
        function ($scope, $modalInstance, parentScope, resource) {
            $scope.name = resource.firstName + ' ' + resource.surname;
            $scope.accept = false;
            $scope.errorMessage = false;
            $scope.message = '';

            $scope.ok = function () {
                if ($scope.accept) {
                    $scope.errorMessage = false;
                    $scope.dataLoading = true;
                    parentScope.deletResource(resource,
                            function (success, message) {
                                if (success) {
                                    parentScope.removeFromList(resource);
                                    $modalInstance.close();
                                } else {
                                    $scope.errorMessage = true
                                    $scope.message = message;
                                }
                            }
                    );
                } else {
                    $scope.message = 'Please accept that you want to remove the employee.';
                    $scope.errorMessage = true;
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

angular.module('Resource').filter('filterMultiple', ['$filter', function ($filter) {
        return function (items, values, pagination) {
            if (values && Array === values.constructor) {
                var results = items;
                angular.forEach(values, function (value) {
                    if (value) {
                        if (items && Array === items.constructor) {
                            results = $filter('filter')(results, value);
                        }
                    }
                });

                if (items && Array === items.constructor) {
                    if (values && Array === values.constructor) {
                        pagination.searchSize = results.length;
                        items = results.slice(
                                ((pagination.currentPage - 1) * pagination.itemsPerPage),
                                ((pagination.currentPage) * pagination.itemsPerPage)
                                );
                    }
                }
            }
            return items;
        };
    }]);
                