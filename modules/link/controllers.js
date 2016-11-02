'use strict';
angular.module('Link')
        .controller('LinkController',
                ['$scope', '$rootScope', '$location', 'LinkService',
                    function ($scope, $rootScope, $location, LinkService) {
                        $scope.assetId = $location.search().assetId;
                        $scope.resourceId = $location.search().resourceId;
                        var name = $location.search().name;

                        $scope.loadPage = function () {
                            if (name) {
                                $scope.name = name;
                            } else {
                                $scope.name = "Asset Audit Trail"
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
                            console.log("response : " + JSON.stringify(response));
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    $scope.links = response.links;
                                    $scope.links.viewby = 5;
                                    $scope.links.totalItems = $scope.links.length;
                                    $scope.links.currentPage = 1;
                                    $scope.links.itemsPerPage = 5;
                                    $scope.links.maxSize = 5;
                                    $scope.dataLoading = false;

                                    angular.forEach($scope.links, function (link) {
                                        $scope.loadResource(link);
                                        link.date = $scope.formatDate(new Date(link.date))
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
                                                // asset type success or error
                                                link.linkedResource = response.resource.firstName + " " + response.resource.surname;
                                                link.resource = response.resource;
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
                        }
                        
                        
//                        $scope.loadAsset = function (link) {
//                            if (link.assetId) {
//                                LinkService.getAsset(
//                                        $rootScope.globals.currentUser.access_token,
//                                        link.assetId,
//                                        function (response) {
//                                            // token auth error
//                                            if (response.error_description) {
//                                                $scope.error = response.error_description + ". Please logout!";
//                                            } else {
//                                                // asset type success or error
//                                                link.linkedResource = response.resource.firstName + " " + response.resource.surname;
//                                                link.resource = response.resource;
//                                            }
//                                        }
//                                );
//                            }
//                        };


                        // check if even for row odd and even colors
                        $scope.isEven = function (value) {
                            if (value % 2 === 0) {
                                return "success";
                            } else {
                                return "active";
                            }
                        };

                        $scope.loadPage();
                    }]);
