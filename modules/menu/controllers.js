'use strict';

angular.module('Menu')
        .controller('MenuController',
                ['$scope', '$rootScope', '$location', 'MenuService', '$modal',
                    function ($scope, $rootScope, $location, MenuService, $modal) {
                        $scope.menuId = $location.search().menuId ? $location.search().menuId : null;
                        $scope.new = $location.search().new ? $location.search().new : null;
                        $scope.type = $location.search().type ? $location.search().type : null;
                        $scope.menu = {'templates': []};
                        $scope.pagination = {};

                        $scope.newCollapse = false;
                        $scope.menus = [];

                        $scope.loadPage = function () {
                            $scope.loadTemplates();
                            $scope.loadMenus();
                            if ($scope.new) {
                                $scope.newCollapse = true;
                            }
                        };

                        $scope.loadMenus = function () {
                            MenuService.getAllMenus(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            if (response.menus) {
                                                $scope.menus = response.menus;
                                                $scope.pagination.totalItems = response.menus.length;
                                                $scope.pagination.currentPage = 1;
                                                $scope.pagination.itemsPerPage = 5;
                                                $scope.pagination.maxSize = 5;
                                                $scope.pagination.viewby = 5;
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.loadTemplates = function () {
                            MenuService.getAllTypes($rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                if ("Access is denied" !== response.error_description) {
                                                    $scope.error = response.error_description + ". Please logout!";
                                                }
                                            } else {
                                                if (response.types) {
                                                    $scope.types = response.types;
                                                }
                                            }
                                        }
                                    }
                            );
                        };

                        // remove item by index from items
                        $scope.remove = function (index) {
                            var item = $scope.menu.templates[index];
                            $scope.menu.templates.splice($scope.menu.templates.indexOf(item), 1);
                        };
                        // Move item up or down in the array index
                        $scope.move = function (old_index, new_index) {
                            while (old_index < 0) {
                                old_index += $scope.menu.templates.length;
                            }
                            while (new_index < 0) {
                                new_index += $scope.menu.templates.length;
                            }
                            if (new_index >= this.length) {
                                var k = new_index - $scope.menu.templates.length;
                                while ((k--) + 1) {
                                    $scope.menu.templates.push(undefined);
                                }
                            }
                            $scope.menu.templates.splice(new_index, 0, $scope.menu.templates.splice(old_index, 1)[0]);
                        };

                        $scope.selectIndex = null;
                        $scope.edit = function (index) {
                            $scope.selectIndex = index;
                            $scope.template = $scope.menu.templates[index];
                        };

                        $scope.add = function () {
                            if ($scope.template) {
                                var index = $scope.menu.templates.indexOf($scope.template);
                                var hasValue = (parseInt(index) >= 0
                                        || parseInt(index) !== -1)
                                        && $scope.selectIndex == null;
                                if (!hasValue) {
                                    $scope.template.allowScopeChallenge = $scope.allowScopeChallenge;
                                    if ($scope.selectIndex == null) {
                                        $scope.menu.templates.push($scope.template);
                                    } else {
                                        $scope.menu.templates[$scope.selectIndex] = $scope.template;
                                        $scope.selectIndex = null;
                                    }
                                    $scope.pageError = null;
                                    $scope.template = null;
                                } else {
                                    $scope.pageError = 'No duplicate templates allowed in template list';
                                }
                            } else {
                                $scope.pageError = 'Please select a template for your template list';
                            }
                        };

                        // reset input boxes
                        $scope.cancel = function () {
                            $scope.template = null;
                            $scope.pageError = null;
                            $scope.selectIndex = null;
                        };

                        // reset input boxes
                        $scope.reset = function (messages) {
                            $scope.menu = {'templates': []};
                            $scope.id = null;
                            // include messages
                            if (messages) {
                                $scope.success = null;
                                $scope.error = null;
                            }
                        };

                        $scope.editMenu = function (id) {
                            $scope.id = id;
                            MenuService.getMenu(
                                    $rootScope.globals.currentUser.access_token,
                                    id,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.success = null;
                                            $scope.error = response.error_description;
                                        } else {
                                            // Menu success or error
                                            $scope.menu = response.menu;
                                            if ($scope.menu.templates) {
                                                angular.forEach($scope.menu.templates, function (template) {
                                                    if ($scope.types) {
                                                        angular.forEach($scope.types, function (type) {
                                                            if (template.id === type.id) {
                                                                var index = $scope.types.indexOf(type);
                                                                $scope.types[index] = template;
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                            $scope.newCollapse = true;
                                        }
                                    }
                            );
                        };

                        $scope.submit = function () {
                            if ($scope.type) {
                                $scope.menu.menuType = $scope.type;
                            }
                            // send type data to ajax call.
                            // rest controller method add url /add
                            MenuService.saveMenu($rootScope.globals.currentUser.access_token,
                                    $scope.menu, function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.success = null;
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            // asset type success or error
                                            if (response.success) {
                                                //success
                                                $scope.success = 'Successfully saved a new menu item, create new menu item ?';

                                                $scope.error = null;
                                                $scope.dataLoading = false;
                                                // Reset all data
                                                $scope.loadMenus();
                                                $scope.reset();
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
                                return "";//"info";
                            } else {
                                return "active";
                            }
                        };

                        // check if even for row odd and even colors
                        $scope.isExpanded = function () {
                            if (!$scope.newCollapse) {
                                return "glyphicon glyphicon-collapse-down";//"info";
                            } else {
                                return "glyphicon glyphicon-collapse-up";
                            }
                        };

                        $scope.deleteMenu = function (menu, callback) {
                            MenuService.deleteMenu(
                                    $rootScope.globals.currentUser.access_token,
                                    menu.id,
                                    function (response) {
                                        if (response.error_description) {
                                            callback(false, response.error_description);
                                        } else {
                                            callback(true);
                                        }
                                    }
                            );
                        };

                        // remove item by index from items
                        $scope.removeFromList = function (menu) {
                            var index = $scope.menus.indexOf(menu);
                            $scope.menus.splice(index, 1);
                        };

                        $scope.removeMenu = function (menu) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/menu/templates/deletemenu.html',
                                controller: 'ModalDeleteMenuCtrl',
                                resolve: {
                                    parentScope: function () {
                                        return $scope;
                                    },
                                    menu: function () {
                                        return menu;
                                    }
                                }
                            });
                        };

                        $scope.loadPage();
                    }]);

