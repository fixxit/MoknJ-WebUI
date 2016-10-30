'use strict';

angular.module('Home')
        .controller('HomeController',
                ['$scope', '$rootScope', '$location', 'HomeService',
                    function ($scope, $rootScope, $location, HomeService) {
                        $scope.types = {};
                        HomeService.getAllTypes($rootScope.globals.currentUser.access_token,
                                function (response) {
                                   
                                    if (response) {
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            if (response.types) {
                                                $scope.types = response.types;
                                                angular.forEach($scope.types, function (type) {
                                                    HomeService.getAllAssetForType(
                                                            $rootScope.globals.currentUser.access_token,
                                                            type.id,
                                                            function (response) {                                                           
                                                                if (response) {
                                                                    if (response.assets) {
                                                                        type.assets = [];  
                                                                        angular.forEach(response.assets, function (asset) {
                                                                            var fields = [];
                                                                            angular.forEach(type.details, function (detail) {   
                                                                                angular.forEach(asset.details, function (field) {
                                                                                    if (detail.id === field.id) {
                                                                                        field.type = detail.type;
                                                                                        fields.push(field);
                                                                                    }
                                                                                });                                                                              
                                                                            });
                                                                            asset.details = fields;
                                                                            type.assets.push(asset);
                                                                        });
                                                                        
                                                                        type.assets.viewby = 5;
                                                                        type.assets.totalItems = response.assets.length;
                                                                        type.assets.currentPage = 1;
                                                                        type.assets.itemsPerPage = type.assets.viewby;
                                                                        type.assets.maxSize = 5; //Number of pager buttons to show
                                                                    }
                                                                }
                                                            }
                                                    );
                                                });
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

                        // check if even for row odd and even colors
                        $scope.isEven = function (value) {
                            if (value % 2 === 0) {
                                return "success";
                            } else {
                                return "active";
                            }
                        };

                        $scope.edit = function (id, assetID) {
                            $location.path('/asset').search({id: id, assetId: assetID});
                        };

                        $scope.editType = function (id) {
                            $location.path('/type').search({id: id});
                        };

                    }]);