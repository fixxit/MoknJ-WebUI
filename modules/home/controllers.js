'use strict';

angular.module('Home')
        .controller('HomeController',
                ['$scope', '$rootScope', '$location', 'HomeService', '$modal',
                    function ($scope, $rootScope, $location, HomeService, $modal) {
                        $scope.types = {};

                        $scope.getAllAssetForType = function (type) {
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
                                                        var noFieldFound = true;
                                                        angular.forEach(asset.details, function (field) {
                                                            if (detail.id === field.id) {
                                                                field.type = detail.type;
                                                                fields.push(field);
                                                                noFieldFound = false;
                                                            }
                                                        });
                                                        // add blank value for field which dont exist...
                                                        if (noFieldFound) {
                                                            var field = {'value': "N/A", 'type': "ASSET_INPUT_STR_TYPE"};
                                                            fields.push(field);
                                                        }
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
                        }

                        $scope.loadPage = function (typeId) {
                            HomeService.getAllTypes($rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                if (response.types) {
                                                    // do not refresh the entire structure
                                                    if (!typeId) {
                                                        $scope.types = response.types;
                                                    }

                                                    angular.forEach($scope.types, function (type) {
                                                        // filter all or only on type 
                                                        // depending on if typeId
                                                        // is set
                                                        if (typeId) {
                                                            if (type.id === typeId) {
                                                                $scope.getAllAssetForType(type);
                                                            }
                                                        } else {
                                                            $scope.getAllAssetForType(type);
                                                        }
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
                        }

                        $scope.loadPage();

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
                        
                        $scope.newAsset = function (id) {
                            $location.path('/asset').search({id: id});
                        };

                        $scope.remove = function (asset, name) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: 'myModalContent.html',
                                controller: 'ModalInstanceCtrl',
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
                    }]);


angular.module('Home').controller('ModalInstanceCtrl',
        function ($scope, $modalInstance, parentScope, HomeService, asset, name, token) {
            $scope.name = name;
            $scope.message = "Are you sure you want to delete asset id[" + asset.id + "] this record ?";

            $scope.ok = function () {
                HomeService.deleteAsset(token, asset,
                        function (response) {
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    if (response.success) {
                                        parentScope.loadPage(asset.typeId);
                                    } else {
                                        $scope.message = response.message;
                                    }
                                }
                            } else {
                                $scope.error = "Invalid server response";
                            }
                        }
                );
                $modalInstance.close();
            };
            

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });



