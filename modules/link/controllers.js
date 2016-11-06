'use strict';
angular.module('Link')
        .controller('LinkController',
                ['$scope', '$rootScope', '$location', 'LinkService',
                    function ($scope, $rootScope, $location, LinkService) {
                        $scope.assetId = $location.search().assetId;
                        $scope.resourceId = $location.search().resourceId;
                        $scope.pagination = {};
                        
                        var name = $location.search().name;

                        $scope.loadPage = function () {
                            if (name) {
                                $scope.name = name;
                            } else {
                                $scope.name = "Asset Audit Trail";
                            }

                            if ($scope.assetId) {
                                $scope.getLinksByAssetId($scope.assetId);
                            } else if ($scope.resourceId) {
                                $scope.getLinksByResourceId($scope.resourceId);
                            } else {
                                $scope.getAllLinks();
                            }
                        };

                        $scope.process = function (response) {
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    $scope.links = response.links;
                                    $scope.pagination.viewby = 10;
                                    $scope.pagination.totalItems = $scope.links.length;
                                    $scope.pagination.currentPage = 1;
                                    $scope.pagination.itemsPerPage = 10;
                                    $scope.pagination.maxSize = 10;
                                    $scope.dataLoading = false;

                                    angular.forEach($scope.links, function (link) {
                                        $scope.loadResource(link);
                                        $scope.loadAsset(link);
                                        link.date = $scope.formatDate(new Date(link.date));
                                        if (link.checked) {
                                            link.checkedDir = "CHECKED-OUT";
                                        } else {
                                            link.checkedDir = "CHECKED-IN";
                                        }
                                    });
                                }
                            } else {
                                $scope.error = "Invalid server response";
                            }
                        };

                        $scope.getLinksByAssetId = function (assetId) {
                            LinkService.allLinkForAssetId(
                                    $rootScope.globals.currentUser.access_token,
                                    assetId,
                                    $scope.process
                                    );
                        };

                        $scope.getLinksByResourceId = function (resourceId) {
                            LinkService.allLinkForResourceId(
                                    $rootScope.globals.currentUser.access_token,
                                    resourceId,
                                    $scope.process
                                    );
                        };

                        $scope.getAllLinks = function () {
                            LinkService.allLink(
                                    $rootScope.globals.currentUser.access_token,
                                    $scope.process
                                    );
                        };

                        $scope.loadResource = function (link) {
                            if (link.resourceId) {
                                LinkService.getResource(
                                        $rootScope.globals.currentUser.access_token,
                                        link.resourceId,
                                        function (response) {
                                            // token auth error
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                if (response.resource) {
                                                    // asset type success or error
                                                    link.linkedResource = response.resource.firstName + " " + response.resource.surname;
                                                    link.resource = response.resource;
                                                }
                                            }
                                        }
                                );
                            }
                        };

                        $scope.formatDate = function (date) {
                            var year = date.getFullYear();
                            var month = (1 + date.getMonth()).toString();
                            month = month.length > 1 ? month : '0' + month;
                            var day = date.getDate().toString();
                            day = day.length > 1 ? day : '0' + day;
                            return year + '-' + month + '-' + day;
                        };

                        $scope.stripTrailing = function (str, trimStr) {
                            if (str.substr(0, 1) === trimStr) {
                                str = str.substring(1);
                            }
                            var len = str.length;
                            if (str.substr(len - 1, 1) === trimStr) {
                                str = str.substring(0, len - 1);
                            }
                            return str;
                        };

                        $scope.loadAsset = function (link) {
                            if (link.assetId) {
                                LinkService.getAsset(
                                        $rootScope.globals.currentUser.access_token,
                                        link.assetId,
                                        function (response) {
                                            // token auth error
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                // asset type success or error
                                                if (response.asset) {
                                                    $scope.loadAssetDetails(response.asset, link);
                                                }
                                            }
                                        }
                                );
                            }
                        };

                        $scope.loadAssetDetails = function (asset, link) {
                            link.display = "";
                            LinkService.getDetail($rootScope.globals.currentUser.access_token, asset.typeId,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                if (response.type) {
                                                    $scope.type = response.type;
                                                    link.display = $scope.type.name + " [";
                                                    angular.forEach(asset.details, function (field) {
                                                        angular.forEach($scope.type.details, function (detail) {
                                                            if (detail.id === field.id) {
                                                                if (detail.display) {
                                                                    link.display = link.display + field.value + "-";
                                                                }
                                                            }
                                                        });
                                                    });
                                                    link.display = $scope.stripTrailing(link.display, "-") + "]";
                                                }
                                            }
                                        }
                                    }
                            );
                        };

                        // check if even for row odd and even colors
                        $scope.isEven = function (value) {
                            if (value % 2 === 0) {
                                return "success";
                            } else {
                                return "active";
                            }
                        };

                        // check if even for row odd and even colors
                        $scope.getCheckedClass = function (checked) {
                            if (checked) {
                                return "glyphicon glyphicon-arrow-left";
                            } else {
                                return "glyphicon glyphicon-arrow-right";
                            }
                        };

                        $scope.loadPage();
                    }]);

angular.module('Link').filter('filterMultiple', ['$filter', function ($filter) {
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
