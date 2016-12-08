'use strict';

angular.module('Home')
        .controller('HomeController',
                ['$scope', '$rootScope', '$location', 'HomeService', '$modal',
                    function ($scope, $rootScope, $location, HomeService, $modal) {
                        $scope.id = $location.search().id ? $location.search().id : null;
                        $scope.templateId = $location.search().templateId ? $location.search().templateId : null;
                        $scope.resourceId = $location.search().resourceId ? $location.search().resourceId : null;
                        $scope.name = "Home";
                        $scope.types = {};
                        $scope.selectedType = null;
                        $scope.selectedResource = null;

                        $scope.urls = {
                            'user': '#/user',
                            'menu': '#/menu',
                            'create_menu_employee': '#/menu?new=true&type=GBL_MT_EMPLOYEE',
                            'create_menu_asset': '#/menu?new=true&type=GBL_MT_ASSET',
                            'template': '#/type',
                            'hidden': '#/hidden_template',
                            'link': '#/link'
                        };

                        $scope.modules = {
                            'asset': {
                                'url': '../modules/templatetypes/views/asset/assetTableView.html',
                                'module': 'GBL_TT_ASSET'
                            },
                            'employee': {
                                'url': '../modules/templatetypes/views/employee/employeeTableView.html',
                                'module': 'GBL_TT_EMPLOYEE'
                            }
                        };

                        $scope.setURLs = function (id) {
                            if (id) {
                                $scope.urls = {
                                    'user': '#/user?menuId=' + id,
                                    'menu': '#/menu?menuId=' + id,
                                    'create_menu_employee': '#/menu?new=true&type=GBL_MT_EMPLOYEE&menuId=' + id,
                                    'create_menu_asset': '#/menu?new=true&type=GBL_MT_ASSET&menuId=' + id,
                                    'template': '#/type?menuId=' + id,
                                    'hidden': '#/hidden_template?menuId=' + id,
                                    'link': '#/link?menuId=' + id
                                };
                            }
                        };

                        $scope.getTemplateEnties = function (type) {
                            if (type.templateType === $scope.modules.asset.module) {
                                HomeService.getAllAssetForType(
                                        $rootScope.globals.currentUser.access_token,
                                        type.id,
                                        $scope.id,
                                        function (response) {
                                            $scope.getModuleDetails(type, response);
                                        }
                                );
                            } else if (type.templateType === $scope.modules.employee.module) {
                                HomeService.getAllEmployeeForType(
                                        $rootScope.globals.currentUser.access_token,
                                        type.id,
                                        $scope.id,
                                        function (response) {
                                            $scope.getModuleDetails(type, response);
                                        }
                                );
                            }
                        };

                        $scope.getFieldDetails = function (entries, type, values) {
                            if (entries) {
                                angular.forEach(entries, function (entry) {
                                    var fields = [];
                                    angular.forEach(type.details, function (detail) {
                                        var noFieldFound = true;
                                        angular.forEach(entry.details, function (field) {
                                            if (detail.id === field.id) {
                                                field.type = detail.type;
                                                // parse date for filters
                                                if (field.type === 'GBL_INPUT_DAT_TYPE') {
                                                    field.value = $scope.formatDate(new Date(field.value));
                                                }
                                                fields.push(field);
                                                noFieldFound = false;
                                            }
                                        });
                                        // add blank value for field which dont exist...
                                        if (noFieldFound) {
                                            var field = {'value': "n/a", 'type': "GBL_INPUT_TXT_TYPE"};
                                            fields.push(field);
                                        }
                                    });
                                    entry.details = fields;
                                    values.push(entry);
                                });
                            }
                        }

                        $scope.getModuleDetails = function (type, response) {
                            if (response) {
                                if (type.templateType === $scope.modules.asset.module) {
                                    if (response.assets) {
                                        type.loading = true;
                                        type.assets = [];
                                        type.totalItems = response.assets.length;
                                        $scope.getFieldDetails(response.assets, type, type.assets);
                                        type.viewby = 5;
                                        type.currentPage = 1;
                                        type.itemsPerPage = type.viewby;
                                        type.maxSize = 5; //Number of pager buttons to show
                                        type.loading = false;
                                        angular.forEach(response.assets, function (asset) {
                                            $scope.loadResource(asset);
                                        });
                                    }
                                } else if (type.templateType === $scope.modules.employee.module) {
                                    if (response.employees) {
                                        type.loading = true;
                                        type.employees = [];
                                        type.totalItems = response.employees.length;
                                        $scope.getFieldDetails(response.employees, type, type.employees);
                                        type.viewby = 10;
                                        type.currentPage = 1;
                                        type.itemsPerPage = type.viewby;
                                        type.maxSize = 10; //Number of pager buttons to show
                                        type.loading = false;
                                        angular.forEach(response.employees, function (employee) {
                                            $scope.loadResource(employee);
                                        });
                                    }
                                }
                            }
                        };

                        $scope.refreshAsset = function (asset, load_resource) {
                            angular.forEach($scope.types, function (type) {
                                if (type.id === asset.typeId) {
                                    angular.forEach(type.assets,
                                            function (type_asset) {
                                                if (type_asset.id === asset.id) {
                                                    type_asset = asset;
                                                    if (load_resource) {
                                                        $scope.loadResource(type_asset);
                                                    } else {
                                                        type_asset.linkedResource = 'unassigned';
                                                        type_asset.resource = {};
                                                    }
                                                }
                                            }
                                    );
                                }
                            });
                        };

                        // remove item by index from items
                        $scope.removeAssetFromTemplate = function (typeId, remove) {
                            angular.forEach($scope.types, function (type) {
                                if (type.id === typeId) {
                                    var index = 0;
                                    angular.forEach(type.assets, function (asset) {
                                        if (asset.id === remove.id) {
                                            type.assets.splice(index, 1);
                                        }
                                        index = index + 1;
                                    });
                                }
                            });
                        };

                        // remove employee by index from employees
                        $scope.removeEmployeeFromTemplate = function (typeId, remove) {
                            angular.forEach($scope.types, function (type) {
                                if (type.id === typeId) {
                                    var index = 0;
                                    angular.forEach(type.employees, function (employee) {
                                        if (employee.id === remove.id) {
                                            type.employees.splice(index, 1);
                                        }
                                        index = index + 1;
                                    });
                                }
                            });
                        };

                        $scope.formatDate = function (date) {
                            var year = date.getFullYear();
                            var month = (1 + date.getMonth()).toString();
                            month = month.length > 1 ? month : '0' + month;
                            var day = date.getDate().toString();
                            day = day.length > 1 ? day : '0' + day;
                            return year + '-' + month + '-' + day;
                        };

                        $scope.loadResource = function (asset) {
                            if (asset.resourceId) {
                                HomeService.getResource(
                                        $rootScope.globals.currentUser.access_token,
                                        asset.resourceId,
                                        function (response) {
                                            // token auth error
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                if (response.resource) {
                                                    // asset type success or error
                                                    asset.linkedResource = response.resource.firstName + " " + response.resource.surname;
                                                    asset.resource = response.resource;
                                                } else {
                                                    asset.resource = null;
                                                    asset.linkedResource = 'employee deleted';
                                                }
                                            }
                                        }
                                );
                            } else {
                                asset.linkedResource = 'unassigned';
                            }
                        };

                        $scope.loadAllResources = function () {
                            HomeService.all(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            if (response.resources) {
                                                // asset type success or error
                                                $scope.resources = response.resources;
                                                // Checks if the resource was selected.
                                                angular.forEach($scope.resources, function (resource) {
                                                    if ($scope.resourceId == resource.id) {
                                                        $scope.selectedResource = resource;
                                                    }
                                                });
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.deleteTemplate = function (id, cascade, token, callback) {
                            if (id) {
                                HomeService.deleteTemplate(
                                        token,
                                        id,
                                        cascade,
                                        function (response) {
                                            // token auth error
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                callback();
                                            }
                                        }
                                );
                            }
                        };

                        $scope.loadMenus = function () {
                            HomeService.getAllMenus(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            if (response.menus) {
                                                $scope.menus = response.menus;
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.loadTemplateForMenu = function (typeId) {
                            HomeService.getMenu($rootScope.globals.currentUser.access_token,
                                    $scope.id,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                if ("Access is denied" !== response.error_description) {
                                                    $scope.error = response.error_description + ". Please logout!";
                                                }
                                            } else {
                                                if (response.menu) {
                                                    // do not refresh the entire structure
                                                    $scope.module = response.menu.menuType;
                                                    $scope.name = response.menu.pageName;
                                                    if (!typeId) {
                                                        $scope.types = response.menu.templates;
                                                    }

                                                    angular.forEach($scope.types, function (type) {
                                                        type.loading = true;
                                                        // filter all or only on type 
                                                        // depending on if typeId
                                                        // is set
                                                        if ($scope.templateId == type.id) {
                                                            $scope.selectedType = type;
                                                            $scope.selectedType.newCollapse = true;
                                                        }

                                                        angular.forEach(type.details, function (detail) {
                                                            if (detail.type === 'GBL_INPUT_DRP_TYPE') {
                                                                var n = detail.name.indexOf(":");
                                                                var name = detail.name.substring(0, n);
                                                                detail.name = name;
                                                            }
                                                        });

                                                        if (typeId) {
                                                            if (type.id === typeId) {
                                                                $scope.getTemplateEnties(type);
                                                            }
                                                        } else {
                                                            $scope.getTemplateEnties(type);
                                                        }

                                                        type.loading = false;
                                                    });
                                                    $scope.dataLoading = false;
                                                }
                                            }
                                        } else {
                                            $scope.error = "Oops! Something weird is going on... This page did not load. Please retry in 5 mins.";
                                        }
                                    }
                            );
                        };

                        $scope.loadPage = function (typeId) {
                            $scope.loadMenus();
                            $scope.loadAllResources();
                            if ($scope.id) {
                                $scope.setURLs($scope.id);
                                $scope.loadTemplateForMenu(typeId);
                            }
                        };

                        // check if even for row odd and even colors
                        $scope.isEven = function (value) {
                            if (value % 2 === 0) {
                                return "";//"info";
                            } else {
                                return "active";
                            }
                        };

                        $scope.isCollapsed = function (newCollapse) {
                            if (newCollapse) {
                                return "glyphicon glyphicon-resize-full";
                            } else {
                                return "glyphicon glyphicon-resize-small";
                            }
                        };

                        $scope.edit = function (id, assetId) {
                            $location.path('/asset').search({'id': id, 'assetId': assetId, 'menuId': $scope.id});
                        };

                        $scope.editEmployee = function (id, employeeId) {
                            $location.path('/employee').search({'id': id, 'employeeId': employeeId, 'menuId': $scope.id});
                        };

                        $scope.editType = function (id, origin) {
                            $location.path('/type').search(
                                    {
                                        'id': id,
                                        'menuId': $scope.id,
                                        'new': true,
                                        'origin': origin
                                    }
                            );
                        };

                        $scope.newAsset = function (id) {
                            $location.path('/asset').search({'id': id, 'menuId': $scope.id});
                        };

                        $scope.newEmploye = function (id) {
                            if ($scope.selectedResource) {
                                $location.path('/employee').search(
                                        {
                                            'id': id,
                                            'menuId': $scope.id,
                                            'resourceId': $scope.selectedResource.id
                                        }
                                );
                            } else {
                                $location.path('/employee').search(
                                        {'id': id, 'menuId': $scope.id}
                                );
                            }
                        };

                        $scope.viewAudit = function (id, name) {
                            $location.path('/link').search({'assetId': id, 'name': name, 'menuId': $scope.id});
                        };

                        $scope.removeAsset = function (asset, name, typeId) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/templatetypes/asset/delete/deleteasset.html',
                                controller: 'ModalDeleteAssetCtrl',
                                resolve: {
                                    parentScope: function () {
                                        return $scope;
                                    },
                                    HomeService: function () {
                                        return HomeService;
                                    },
                                    asset: function () {
                                        return asset;
                                    },
                                    name: function () {
                                        return name;
                                    },
                                    token: function () {
                                        return $rootScope.globals.currentUser.access_token;
                                    },
                                    typeId: function () {
                                        return typeId;
                                    }
                                }
                            });
                        };

                        $scope.removeEmployee = function (employee, name, typeId) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/templatetypes/employee/delete/deleteemployee.html',
                                controller: 'ModalDeleteEmployeeCtrl',
                                resolve: {
                                    parentScope: function () {
                                        return $scope;
                                    },
                                    HomeService: function () {
                                        return HomeService;
                                    },
                                    employee: function () {
                                        return employee;
                                    },
                                    name: function () {
                                        return name;
                                    },
                                    token: function () {
                                        return $rootScope.globals.currentUser.access_token;
                                    },
                                    typeId: function () {
                                        return typeId;
                                    }
                                }
                            });
                        };

                        $scope.removeType = function (type) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/home/templates/deletetype.html',
                                controller: 'ModalDeleteTypeCtrl',
                                resolve: {
                                    parentScope: function () {
                                        return $scope;
                                    },
                                    type: function () {
                                        return type;
                                    },
                                    token: function () {
                                        return $rootScope.globals.currentUser.access_token;
                                    }
                                }
                            });
                        };

                        $scope.assignAsset = function (asset, name) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/templatetypes/asset/assign/linkasset.html',
                                controller: 'ModalAssignAssetCtrl',
                                size: 'lg',
                                resolve: {
                                    parentScope: function () {
                                        return $scope;
                                    },
                                    HomeService: function () {
                                        return HomeService;
                                    },
                                    asset: function () {
                                        return asset;
                                    },
                                    name: function () {
                                        return name;
                                    },
                                    token: function () {
                                        return $rootScope.globals.currentUser.access_token;
                                    }
                                }
                            });
                        };

                        $scope.removeLink = function (asset, name) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/templatetypes/asset/unassign/removelink.html',
                                controller: 'ModalRemoveLinkCtrl',
                                resolve: {
                                    parentScope: function () {
                                        return $scope;
                                    },
                                    HomeService: function () {
                                        return HomeService;
                                    },
                                    asset: function () {
                                        return asset;
                                    },
                                    name: function () {
                                        return name;
                                    },
                                    token: function () {
                                        return $rootScope.globals.currentUser.access_token;
                                    }
                                }
                            });
                        };

                        $scope.setType = function (type) {
                            if (!$scope.selectedType) {
                                $scope.selectedType = type;
                                $scope.selectedType.newCollapse = true;
                            } else {
                                $scope.selectedType.newCollapse = false;
                                if (type === $scope.selectedType) {
                                    $scope.selectedType = null;
                                } else {
                                    $scope.selectedType = type;
                                    $scope.selectedType.newCollapse = true;
                                }
                            }

                        };

                        $scope.isSelectedType = function (type) {
                            if (type === $scope.selectedType) {
                                return "list-group-item active"
                            } else {
                                return "list-group-item";
                            }
                        };


                        $scope.selectResource = function (resource) {
                            if (resource === $scope.selectedResource) {
                                $scope.selectedResource = null;
                            } else {
                                $scope.selectedResource = resource;
                            }
                        };

                        $scope.isSelectedResource = function (resource) {
                            if (resource === $scope.selectedResource) {
                                return "list-group-item active"
                            } else {
                                return "list-group-item";
                            }
                        };

                        $scope.loadPage();
                    }]);





