'use strict';

angular.module('Menu')
        .controller('MenuController',
                ['$scope', '$rootScope', '$location', 'MenuService',
                    function ($scope, $rootScope, $location, MenuService) {
                        $scope.menuId = $location.search().menuId ? $location.search().menuId : null;
                        $scope.menu = {'templates': []};

                        $scope.loadPage = function () {
                            $scope.loadTemplates();
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
                                var hasValue = parseInt(index) >= 0
                                        || parseInt(index) !== -1;
                                if (!hasValue) {
                                    if ($scope.selectIndex == null) {
                                        $scope.menu.templates.push($scope.template);
                                    } else {
                                        $scope.menu.templates[$scope.selectIndex] = $scope.template;
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
                        };

                        $scope.isOkOrRemove = function (unique) {
                            if (unique) {
                                return "glyphicon glyphicon-ok";
                            } else {
                                return "glyphicon glyphicon-remove";
                            }
                        };

                        // reset input boxes
                        $scope.reset = function (messages) {
                            $scope.menu = {'templates': []};
                            // include messages
                            if (messages) {
                                $scope.success = null;
                                $scope.error = null;
                            }
                        };

                        $scope.submit = function () {
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

                        $scope.loadPage();
                    }]);