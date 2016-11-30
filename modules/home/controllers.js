'use strict';

angular.module('Home')
        .controller('HomeController',
                ['$scope', '$rootScope', '$location', 'HomeService', '$modal',
                    function ($scope, $rootScope, $location, HomeService, $modal) {
                        $scope.id = $location.search().id ? $location.search().id : null;
                        $scope.name = "Home";
                        $scope.types = {};

                        $scope.urls = {
                            'user': '#/user',
                            'menu': '#/menu',
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
                                    'type': '#/type?menuId=' + id,
                                    'hidden': '#/hidden_template?menuId=' + id,
                                    'link': '#/link?menuId=' + id
                                };
                            }
                        };

                        $scope.getAllAssetForType = function (type) {
                            HomeService.getAllAssetForType(
                                    $rootScope.globals.currentUser.access_token,
                                    type.id,
                                    function (response) {
                                        if (response) {
                                            if (response.assets) {
                                                type.loading = true;
                                                type.assets = [];
                                                angular.forEach(response.assets, function (asset) {
                                                    var fields = [];
                                                    angular.forEach(type.details, function (detail) {
                                                        var noFieldFound = true;
                                                        angular.forEach(asset.details, function (field) {
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
                                                    asset.details = fields;
                                                    $scope.loadResource(asset);
                                                    type.assets.push(asset);
                                                });

                                                type.viewby = 5;
                                                type.totalItems = response.assets.length;
                                                type.currentPage = 1;
                                                type.itemsPerPage = type.viewby;
                                                type.maxSize = 5; //Number of pager buttons to show
                                                type.loading = false;
                                            }
                                        }
                                    }
                            );
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
                                                    $scope.name = response.menu.pageName;
                                                    if (!typeId) {
                                                        $scope.types = response.menu.templates;
                                                    }

                                                    angular.forEach($scope.types, function (type) {
                                                        type.loading = true;
                                                        // filter all or only on type 
                                                        // depending on if typeId
                                                        // is set
                                                        angular.forEach(type.details, function (detail) {
                                                            if (detail.type === 'GBL_INPUT_DRP_TYPE') {
                                                                var n = detail.name.indexOf(":");
                                                                var name = detail.name.substring(0, n);
                                                                detail.name = name;
                                                            }
                                                        });

                                                        if (type.templateType === $scope.modules.asset.module) {
                                                            if (typeId) {
                                                                if (type.id === typeId) {
                                                                    $scope.getAllAssetForType(type);
                                                                }
                                                            } else {
                                                                $scope.getAllAssetForType(type);
                                                            }
                                                        } else if (type.templateType === $scope.modules.employee.module) {

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
                                return "glyphicon glyphicon-collapse-down";
                            } else {
                                return "glyphicon glyphicon-collapse-up";
                            }
                        };

                        $scope.edit = function (id, assetId) {
                            $location.path('/asset').search({'id': id, 'assetId': assetId, 'menuId': $scope.id});
                        };

                        $scope.editType = function (id) {
                            $location.path('/type').search({'id': id, 'menuId': $scope.id});
                        };

                        $scope.newAsset = function (id) {
                            $location.path('/asset').search({'id': id, 'menuId': $scope.id});
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

                        $scope.loadPage();
                    }]);

angular.module('Home').controller('ModalDeleteTypeCtrl',
        function ($scope, $modalInstance, parentScope, type, token) {
            $scope.name = type.name;
            $scope.cascade = false;

            $scope.ok = function () {
                $scope.dataLoading = true;
                parentScope.deleteTemplate(type.id, $scope.cascade, token,
                        function () {
                            parentScope.loadPage();
                            $modalInstance.close();
                        }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

angular.module('Home').filter('filterAssetMultiple', ['$filter', function ($filter) {
        return function (items, values, type) {
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
                        type.searchSize = results.length;
                        var checkedOut = 0;
                        angular.forEach(results, function (result) {
                            var linked = result.linkedResource;
                            if (linked
                                    && linked !== 'unassigned'
                                    && linked !== 'employee deleted') {
                                checkedOut = checkedOut + 1;
                            }
                        });
                        type.checkedOut = checkedOut;
                        type.checkedIn = type.searchSize - checkedOut;
                        items = results.slice(
                                ((type.currentPage - 1) * type.itemsPerPage),
                                ((type.currentPage) * type.itemsPerPage)
                                );
                    }
                }
            }
            return items;
        };
    }]);


angular.module('Home').filter('filterResources', ['$filter', function ($filter) {
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


