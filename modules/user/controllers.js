'use strict';

angular.module('User')
        .controller('UserController',
                ['$scope', '$rootScope', '$location', 'UserService', '$modal',
                    function ($scope, $rootScope, $location, UserService, $modal) {
                        $scope.menuId = $location.search().menuId ? $location.search().menuId : null;
                        $scope.isCollapsed = false;
                        $scope.containerCollapsed = false;
                        $scope.resourceId = $location.search().resourceId;
                        $scope.resource = {};
                        $scope.pagination = {};

                        if ($scope.resourceId) {
                            $scope.resource.id = resourceId;
                        }

                        $scope.loadPage = function (id) {
                            $scope.loading = true;
                            if (id) {
                                $scope.editResource(id);
                            }

                            $scope.getAuthorities();

                            UserService.all($rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                if ("Access is denied" !== response.error_description) {
                                                    $scope.error = response.error_description + ". Please logout!";
                                                }
                                            } else {
                                                if (response.resources) {
                                                    // do not refresh the entire structure
                                                    $scope.resources = response.resources;
                                                    $scope.pagination.viewby = 10;
                                                    $scope.pagination.totalItems = response.resources.length;
                                                    $scope.pagination.currentPage = 1;
                                                    $scope.pagination.itemsPerPage = 10;
                                                    $scope.pagination.maxSize = 10;
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

                        $scope.save = function () {
                            $scope.dataLoading = true;
                            $scope.resource.authorities = [];
                            angular.forEach($scope.authorities, function (auth) {
                                if (auth.value) {
                                    $scope.resource.authorities.push(
                                            auth.name
                                            );
                                }
                            });

                            if (!$scope.resource.systemUser) {
                                $scope.resource.userName = null;
                                $scope.resource.password = null;
                                $scope.resource.authorities = [];
                            }

                            UserService.save(
                                    $rootScope.globals.currentUser.access_token,
                                    $scope.resource,
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
                                                if (!$scope.resourceId) {
                                                    $scope.success = 'Successfully saved a new employee';
                                                } else {
                                                    $scope.success = 'Successfully update employee';
                                                }
                                                $scope.loadPage();
                                                // Reset all data
                                                $scope.reset();
                                                $scope.resourceId = null;
                                            } else {
                                                // error 
                                                $scope.success = null;
                                                $scope.error = response.message;
                                            }
                                        }
                                        $scope.dataLoading = false;
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

                            angular.forEach($scope.authorities, function (auth) {
                                auth.value = false;
                            });
                        };

                        $scope.cancel = function () {
                            $scope.resourceId = null;
                            $scope.reset();
                            $scope.success = null;
                            $scope.error = null;
                        };

                        $scope.deletResource = function (resource, callback) {
                            UserService.remove(
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
                            UserService.get(
                                    $rootScope.globals.currentUser.access_token,
                                    id,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.success = null;
                                            $scope.error = response.error_description;
                                        } else {
                                            // asset type success or error
                                            $scope.resource = response.resource;
                                            angular.forEach($scope.authorities, function (auth) {
                                                var value = false;
                                                angular.forEach($scope.resource.authorities, function (resAuth) {
                                                    if (resAuth === auth.name) {
                                                        value = true;
                                                    }
                                                });
                                                auth.value = value;
                                            });
                                            $scope.newCollapse = true;
                                        }
                                    }
                            );
                        };

                        $scope.getAuthorities = function () {
                            UserService.authorities(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.success = null;
                                            if ("Access is denied" !== response.error_description) {
                                                $scope.error = response.error_description;
                                            }
                                        } else {
                                            if (response.authorities) {
                                                // asset type success or error
                                                $scope.authorities = [];
                                                angular.forEach(response.authorities, function (auth) {
                                                    if (auth) {
                                                        $scope.authorities.push(
                                                                {
                                                                    'name': auth,
                                                                    'value': {}
                                                                }
                                                        );
                                                    }
                                                });
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.removeResource = function (resource) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/user/templates/deleteuser.html',
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

                        $scope.loadPage($scope.resourceId);
                    }]);

angular.module('User').controller('ModalDeleteResourceCtrl',
        function ($scope, $modalInstance, parentScope, resource) {
            $scope.name = resource.firstName + ' ' + resource.surname;
            $scope.accept = false;
            $scope.errorMessage = false;
            $scope.message = '';

            $scope.ok = function () {
                $scope.errorMessage = false;
                $scope.dataLoading = true;
                parentScope.deletResource(resource,
                        function (success, message) {
                            if (success) {
                                parentScope.removeFromList(resource);
                                $modalInstance.close();
                            } else {
                                $scope.errorMessage = true;
                                $scope.message = message;
                            }
                        }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

angular.module('User').filter('filterMultiple', ['$filter', function ($filter) {
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
                