'use strict';

angular.module('Type')
        .controller('TypeController',
                ['$scope', '$rootScope', 'TypeService',
                    function ($scope, $rootScope, TypeService) {
                        // Retrieve all field detail data types via type service
                        // REST controller method types /fields
                        $scope.dataLoading = true;
                        $scope.selectedItem = {'name': 'nosec', 'type': 'no selection'};
                        TypeService.getFieldTypes($rootScope.globals.currentUser.access_token, function (response) {
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    if (response.fieldTypes) {
                                        $scope.types = response.fieldTypes;
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

                        // items in the field detail list
                        $scope.items = [];
                        // selected item desplayed in div
                        $scope.dropboxitemselected = function (item) {
                            $scope.selectedItem = item;
                        };
                        // adding item to the array items
                        $scope.add = function () {
                            // input check
                            if ($scope.selectedItem.name !== 'nosec'
                                    && ($scope.dispname && $scope.dispname.trim() !== '')) {
                                $scope.items.push({'type': $scope.selectedItem, 'name': $scope.dispname});
                                $scope.dispname = '';
                                $scope.selectedItem = {'name': 'nosec', 'type': 'no selection'};
                            } else {
                                // to do !
                                // error message here
                            }
                        };
                        // remove item by index from items
                        $scope.remove = function (index) {
                            var item = $scope.items[index];
                            $scope.items.splice($scope.items.indexOf(item), 1);
                        };
                        // Move item up or down in the array index
                        $scope.move = function (old_index, new_index) {
                            while (old_index < 0) {
                                old_index += $scope.items.length;
                            }
                            while (new_index < 0) {
                                new_index += $scope.items.length;
                            }
                            if (new_index >= this.length) {
                                var k = new_index - $scope.items.length;
                                while ((k--) + 1) {
                                    $scope.items.push(undefined);
                                }
                            }
                            $scope.items.splice(new_index, 0, $scope.items.splice(old_index, 1)[0]);
                        };

                        // check if even for row odd and even colors
                        $scope.isEven = function (value) {
                            if (value % 2 == 0) {
                                return "success";
                            } else {
                                return "active";
                            }
                        };

                        // reset input boxes
                        $scope.reset = function (messages) {
                            // Reset all data
                            $scope.type = {};
                            $scope.items = [];
                            $scope.typename = '';
                            $scope.dispname = '';
                            // include messages
                            if (messages) {
                                $scope.success = null;
                                $scope.error = null;
                            }
                            $scope.selectedItem = {'name': 'nosec', 'type': 'no selection'};
                        };

                        // type array
                        $scope.type = {};
                        $scope.submit = function () {
                            if ($scope.items.length > 0) {
                                // define type array with details
                                $scope.type = {'name': $scope.typename, 'details': []};
                                // loop items and add items to type.details array
                                angular.forEach($scope.items, function (value) {
                                    $scope.type.details.push({'type': value.type.name, 'name': value.name});
                                });
                                // send type data to ajax call.
                                // rest controller method add url /add
                                TypeService.save(
                                        $scope.type, $rootScope.globals.currentUser.access_token, function (response) {
                                            // token auth error
                                            if (response.error_description) {
                                                $scope.success = null;
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                // asset type success or error
                                                if (response.success === true) {
                                                    //success
                                                    $scope.success = 'Successfully saved a new asset type, create new type ?';
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
                            } else {
                                // No field details included...
                                $scope.success = null;
                                $scope.error = "no asset type fields provided";
                            }
                        };
                    }]);