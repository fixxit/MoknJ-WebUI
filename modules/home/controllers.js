'use strict';

angular.module('Home')
        .controller('HomeController',
                ['$scope', '$rootScope', '$location', 'HomeService',
                    function ($scope, $rootScope, $location, HomeService) {
                        $scope.types = {};
                        HomeService.getAllTypes($rootScope.globals.currentUser.access_token,
                                function (response) {
                                    console.log(" response : " + JSON.stringify(response.types));
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
                                                                console.log("asset response : " + JSON.stringify(response));
                                                                if (response) {
                                                                    if (response.assets) {
                                                                        type.assets = response.assets;
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
                            if (value % 2 == 0) {
                                return "success";
                            } else {
                                return "active";
                            }
                        };

                    }]);