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
                        // Access list 
                        // reason for data design is so it is easy to use two way
                        // data bind.
                        $scope.access = [
                            {
                                id: '',
                                name: '',
                                rights: [
                                    {
                                        enumName: '',
                                        displayName: '',
                                        value: ''
                                    }
                                ],
                                templates: [
                                    {
                                        id: '',
                                        name: '',
                                        rights: [
                                            {
                                                enumName: '',
                                                displayName: '',
                                                value: ''
                                            }
                                        ]
                                    }
                                ]
                            }
                        ];

                        if ($scope.resourceId) {
                            $scope.resource.id = $scope.resourceId;
                        }

                        $scope.loadPage = function (id) {
                            $scope.loading = true;
                            if (id) {
                                $scope.editResource(id);
                            }

                            $scope.getAuthorities();
                            $scope.getMenus();

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

                                                $scope.addAccess(response.resource.id);

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

                        // scans access list and checks the main check box of menu
                        // or template if a certain right is repeated.
                        $scope.rescanAccess = function () {
                            if ($scope.access) {
                                var maxMenuCount = $scope.access.length;
                                angular.forEach($scope.rights, function (search_right) {
                                    var rightsCount = 0;
                                    angular.forEach($scope.access, function (menu) {
                                        // template all
                                        if (menu.templates) {
                                            var maxTemplateCount = menu.templates.length;

                                            var templateCount = 0;
                                            angular.forEach(menu.templates, function (template) {
                                                angular.forEach(template.rights, function (page_right) {
                                                    if (search_right.enumName === page_right.enumName) {
                                                        if (page_right.value) {
                                                            templateCount = templateCount + 1;
                                                        }
                                                    }
                                                });
                                            });

                                            if (maxTemplateCount === templateCount) {
                                                angular.forEach(menu.rights, function (page_right) {
                                                    if (search_right.enumName === page_right.enumName) {
                                                        page_right.value = true;

                                                    }
                                                });
                                                rightsCount = rightsCount + 1;
                                            } else {
                                                angular.forEach(menu.rights, function (page_right) {
                                                    if (search_right.enumName === page_right.enumName) {
                                                        page_right.value = false;
                                                    }
                                                });
                                            }
                                        }
                                    });

                                    if (maxMenuCount === rightsCount) {
                                        search_right.value = true;
                                    } else {
                                        search_right.value = false;
                                    }
                                });
                            }
                        };

                        // Adds all access for certain right
                        $scope.addAllForMenu = function (enumName) {
                            if ($scope.access) {
                                var value = false;
                                if ($scope.rights) {
                                    angular.forEach($scope.rights, function (page_right) {
                                        if (enumName === page_right.enumName) {
                                            value = page_right.value;
                                        }
                                    });
                                }
                                angular.forEach($scope.access, function (menu) {
                                    // template all
                                    angular.forEach(menu.rights, function (page_right) {
                                        if (enumName === page_right.enumName) {
                                            page_right.value = value;
                                        }
                                    });
                                    if (menu.templates) {
                                        angular.forEach(menu.templates, function (template) {
                                            angular.forEach(template.rights, function (page_right) {
                                                if (enumName === page_right.enumName) {
                                                    page_right.value = value;
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        };
                        // Adds all access for menu and right
                        $scope.addAllForTemplate = function (menuId, enumName) {
                            if ($scope.access) {
                                angular.forEach($scope.access, function (menu) {
                                    if (menu.id === menuId) {

                                        var value = false;
                                        angular.forEach(menu.rights, function (page_right) {
                                            if (enumName === page_right.enumName) {
                                                value = page_right.value;
                                            }
                                        });

                                        // template all
                                        if (menu.templates) {
                                            angular.forEach(menu.templates, function (template) {
                                                angular.forEach(template.rights, function (page_right) {
                                                    if (enumName === page_right.enumName) {
                                                        page_right.value = value;
                                                    }
                                                });
                                            });
                                        }
                                    }
                                });
                                $scope.rescanAccess();
                            }
                        };

                        // ah shit here are some weird ass wack code son!
                        // Used to generate access array, reason for this is
                        // so you can easily handel two way data bind on the
                        // access rights.
                        $scope.generateAccessArray = function (menus, rights) {
                            if (menus) {
                                var accMenus = [];
                                angular.forEach(menus, function (menu) {
                                    var accMenu = {};
                                    accMenu.id = menu.id;
                                    accMenu.name = menu.name;
                                    accMenu.rights = [];
                                    angular.forEach(rights, function (right) {
                                        var accRight = {};
                                        accRight.displayName = right.displayName;
                                        accRight.enumName = right.enumName;
                                        accRight.value = false;
                                        accMenu.rights.push(accRight);
                                    });

                                    accMenu.templates = [];
                                    if (menu.templates) {
                                        var accTemps = [];
                                        angular.forEach(menu.templates, function (template) {
                                            var accTemp = {};
                                            accTemp.id = template.id;
                                            accTemp.name = template.name;
                                            var accRights = [];
                                            angular.forEach(rights, function (right) {
                                                var accRight = {};
                                                accRight.displayName = right.displayName;
                                                accRight.enumName = right.enumName;
                                                accRight.value = false;
                                                accRights.push(accRight);
                                            });
                                            accTemp.rights = accRights;
                                            accTemps.push(accTemp);
                                        });
                                        accMenu.templates = accTemps;
                                    }
                                    accMenus.push(accMenu);
                                });

                                $scope.access = accMenus;
                            }
                        };

                        /// Adds the access to the api
                        $scope.addAccess = function (userId) {
                            var accessRules = [];
                            angular.forEach($scope.access, function (menu) {
                                if (menu.templates) {
                                    // loop menu structure
                                    angular.forEach(menu.templates, function (template) {
                                        var access = {
                                            menuId: menu.id,
                                            templateId: template.id,
                                            userId: userId,
                                            rights: []};
                                        // add all rights which are true
                                        angular.forEach(template.rights, function (right) {
                                            if (right.value) {
                                                access.rights.push(right.enumName);
                                            }
                                        });
                                        // checks if the  rights list is null
                                        if (access.rights.length > 0) {
                                            accessRules.push(access);
                                        }
                                    });
                                }
                            });

                            console.log("accessRules : " + JSON.stringify(accessRules));
                            // sends the access to api
                            UserService.addAccess(
                                    $rootScope.globals.currentUser.access_token,
                                    userId,
                                    accessRules,
                                    function (response) {
                                        if (response.error_description) {
                                            $scope.success = null;
                                            $scope.error = response.error_description + ". Please contact your administrator.";
                                        } else {
                                            $scope.error = null;
                                            $scope.success = response.error_description;
                                        }
                                    });
                        };


                        // Used to generate access array, reason for this is
                        // so you can easily handel two way data bind on the
                        // access rights.
                        $scope.populateAccessList = function (access) {
                            console.log("access : " + JSON.stringify(access));
                            if ($scope.access) {
                                angular.forEach($scope.access, function (menu) {
                                    var menuId = menu.id;
                                    if (menuId === access.menuId) {
                                        if (menu.templates) {
                                            angular.forEach(menu.templates, function (template) {
                                                var templateId = template.id;
                                                if (templateId === access.templateId) {
                                                    angular.forEach(template.rights, function (page_right) {
                                                        angular.forEach(access.rights, function (acc_right) {
                                                            if (acc_right === page_right.enumName) {
                                                                page_right.value = true;
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        };

                        //Gets the access list for a user
                        $scope.getAccessList = function (id) {
                            UserService.getAccessList(
                                    $rootScope.globals.currentUser.access_token,
                                    id,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.success = null;
                                            if ("Access is denied" !== response.error_description) {
                                                $scope.error = response.error_description;
                                            }
                                        } else {
                                            if (response.accessRules) {
                                                angular.forEach(response.accessRules, function (access) {
                                                    $scope.populateAccessList(access);
                                                });
                                            }
                                        }
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

                        $scope.isCollapsedClass = function (newCollapse) {
                            if (newCollapse) {
                                return "glyphicon glyphicon-collapse-up";
                            } else {
                                return "glyphicon glyphicon-expand";
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
                                            $scope.getAccessList(id);
                                            $scope.newCollapse = true;
                                        }
                                    }
                            );
                        };

                        $scope.getMenus = function () {
                            UserService.getAllMenus(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.success = null;
                                            if ("Access is denied" !== response.error_description) {
                                                $scope.error = response.error_description;
                                            }
                                        } else {
                                            if (response.menus) {
                                                $scope.menus = response.menus;
                                                $scope.getRights($scope.menus);
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.getRights = function (menus) {
                            UserService.allRights(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.success = null;
                                            if ("Access is denied" !== response.error_description) {
                                                $scope.error = response.error_description;
                                            }
                                        } else {
                                            if (response.rights) {
                                                $scope.rights = response.rights;
                                                $scope.generateAccessArray(menus, $scope.rights);
                                            }
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
                