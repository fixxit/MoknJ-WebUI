'use strict';

angular.module('Home')
        .controller('HomeController',
                ['$scope', '$rootScope', '$location', 'HomeService', '$modal',
                    function ($scope, $rootScope, $location, HomeService, $modal) {
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
                                                                                var noFieldFound = true;
                                                                                angular.forEach(asset.details, function (field) {
                                                                                    if (detail.id === field.id) {
                                                                                        field.type = detail.type;
                                                                                        fields.push(field);
                                                                                        noFieldFound = false;
                                                                                        console.log("field : " + JSON.stringify(field));
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

                        $scope.remove = function (id, name) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: 'myModalContent.html',
                                controller: 'ModalInstanceCtrl',
                                resolve: {
                                    id: function () {
                                        return id;
                                    },
                                    name: function () {
                                        return name;
                                    }
                                }
                            });
                        };
                    }]);


angular.module('Home').controller('ModalInstanceCtrl', function ($scope, $modalInstance, id, name) {
    $scope.name = name;
    $scope.message = "Are you sure you want to delete this record ?";

    $scope.ok = function () {
        $modalInstance.close("yes");
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});



