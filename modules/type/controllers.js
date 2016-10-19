/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';

angular.module('Type')
        .controller('TypeController',
                ['$scope', '$rootScope', '$location', 'TypeService',
                    function ($scope, $rootScope, $location, TypeService) {
                        $scope.dataLoading = true;
                        $scope.selectedItem = {'name': '', 'type': 'no selection'};
                        TypeService.getFieldTypes($rootScope.globals.currentUser.access_token, function (response) {
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    if (response.fieldTypes) {
                                        $scope.types = response.fieldTypes;
                                        $scope.dataLoading = false;
                                    } else {
                                        $scope.error = "Invalid server response [102]";
                                    }
                                }
                            }
                        }
                        );

                        $scope.items = [];

                        $scope.dropboxitemselected = function (item) {
                            $scope.selectedItem = item;
                        };

                        $scope.add = function () {
                            $scope.items.push({'type': $scope.selectedItem, 'name': $scope.dispname});
                        };

                        $scope.remove = function (index) {
                            var item = $scope.items[index];
                            $scope.items.splice($scope.items.indexOf(item), 1);
                        };


                        $scope.reset = function () {
                            // Reset all data
                            $scope.type = {};
                            $scope.items = [];
                            $scope.typename = '';
                            $scope.dispname = '';
                            $scope.selectedItem = {'name': '', 'type': 'no selection'};
                        };


                        $scope.type = {};
                        $scope.submit = function () {
                            $scope.type = {'name': $scope.typename, 'details': []};

                            angular.forEach($scope.items, function (value, key) {
                                console.log(key + ': ' + value.name);
                                $scope.type.details.push({'type': value.type.name, 'name': value.name});

                            });

                            TypeService.save(
                                    $scope.type, $rootScope.globals.currentUser.access_token, function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            // asset type success or error
                                            if (response.success === true) {
                                                //success
                                                $scope.success = 'Successfully saved a new asset type, create new type ?';
                                                $scope.dataLoading = false;
                                                // Reset all data
                                                $scope.reset();
                                            } else {
                                                // error 
                                                $scope.error = response.message;
                                            }
                                        }
                                    }
                            );
                        };
                    }]);