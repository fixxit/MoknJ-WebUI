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
                                                                // parse date for filters
                                                                if (field.type === 'ASSET_INPUT_DAT_TYPE') {
                                                                    field.value = $scope.formatDate(new Date(field.value));
                                                                }
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
                                                    $scope.loadResource(asset);
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

                        $scope.formatDate = function (date) {
                            var year = date.getFullYear();
                            var month = (1 + date.getMonth()).toString();
                            month = month.length > 1 ? month : '0' + month;
                            var day = date.getDate().toString();
                            day = day.length > 1 ? day : '0' + day;
                            return year + '-' + month + '-' + day;
                        }

                        $scope.loadResource = function (asset) {
                            if (asset.resourceId) {
                                HomeService.getResource(
                                        $rootScope.globals.currentUser.access_token,
                                        asset.resourceId,
                                        function (response) {
                                            // token auth error
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                // asset type success or error
                                                asset.linkedResource = response.resource.firstName + " " + response.resource.surname;
                                                asset.resource = response.resource;
                                            }
                                        }
                                );
                            }
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

                        $scope.view = function (name, id) {
                            $location.path('/asset').search({id: id});
                        };

                        $scope.removeAsset = function (asset, name) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/home/templates/deleteasset.html',
                                controller: 'ModalDeleteAssetCtrl',
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


                        $scope.removeType = function (type) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/home/templates/deletetype.html',
                                controller: 'ModalDeleteTypeCtrl',
                                resolve: {
                                    parentScope: function () {
                                        return $scope;
                                    },
                                    HomeService: function () {
                                        return HomeService;
                                    },
                                    type: function () {
                                        return type;
                                    },
                                    token: function () {
                                        return $rootScope.globals.currentUser.access_token;
                                    }
                                }
                            });
                        };


                        $scope.assignAsset = function (asset, name) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/home/templates/linkasset.html',
                                controller: 'ModalAssignAssetCtrl',
                                size: 'lg',
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

                        $scope.removeLink = function (asset, name) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/home/templates/removelink.html',
                                controller: 'ModalRemoveLinkCtrl',
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


angular.module('Home').controller('ModalDeleteAssetCtrl',
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

angular.module('Home').controller('ModalDeleteTypeCtrl',
        function ($scope, $modalInstance, parentScope, HomeService, type, token) {
            $scope.name = type.name;
            $scope.message = "blah blah! delete stuff!";

            $scope.ok = function () {
                $modalInstance.close();
            };


            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

angular.module('Home').controller('ModalRemoveLinkCtrl',
        function ($scope, $modalInstance, parentScope, HomeService, asset, name, token) {
            $scope.name = name + " - Check Asset In";

            $scope.ok = function () {
                $scope.link = {
                    'resourceId': asset.resourceId,
                    'assetId': asset.id,
                    'date': $scope.auditdate,
                    'checked': false
                };

                asset.resourceId = null;
                HomeService.addLink(token, $scope.link,
                        function (response) {
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    if (response.success) {
                                        parentScope.loadPage(asset.typeId);
                                        $scope.saveAsset(asset.typeId);
                                    } else {
                                        $scope.message = response.message;
                                    }
                                }
                            } else {
                                $scope.error = "Invalid server response";
                            }
                        }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.saveAsset = function (typeId) {
                HomeService.save(
                        token,
                        typeId,
                        asset,
                        function (response) {
                            // token auth error
                            if (response.error_description) {
                                $scope.error = response.error_description + ". Please logout!";
                            } else {
                                // asset type success or error
                                if (response.success === true) {
                                    $modalInstance.close();
                                } else {
                                    $scope.error = response.message;
                                }
                            }
                        }
                );
            };

            $scope.openDatePickers = [];
            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return (mode === 'day'
                        && (date.getDay() === 0
                                || date.getDay() === 6));
            };

            $scope.openDate = function ($event, datePickerIndex) {
                $event.preventDefault();
                $event.stopPropagation();

                if ($scope.openDatePickers[datePickerIndex] === true) {
                    $scope.openDatePickers.length = 0;
                } else {
                    $scope.openDatePickers.length = 0;
                    $scope.openDatePickers[datePickerIndex] = true;
                }
            };
        });


angular.module('Home').controller('ModalAssignAssetCtrl',
        function ($scope, $modalInstance, parentScope, HomeService, asset, name, token) {
            $scope.name = name + " - Check Asset Out";
            $scope.asset = asset;
            $scope.resources = [];
            $scope.selected = 'Select an Resource';
            $scope.resource = {};

            // selected item desplayed in div
            $scope.dropboxitemselected = function (resource) {
                $scope.selected = resource.fullname;
                $scope.resource = resource;
            };

            $scope.loadPage = function () {
                HomeService.all(token,
                        function (response) {
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    if (response.resources) {
                                        // do not refresh the entire structure
                                        $scope.resources = response.resources;

                                        angular.forEach($scope.resources, function (entry) {
                                            entry.fullname = entry.firstName + " " + entry.surname;
                                        });

                                        console.log("response : " + JSON.stringify($scope.resources));

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
            };

            $scope.loadPage();

            $scope.ok = function () {

                alert($scope.auditdate);
                $scope.link = {
                    'resourceId': $scope.resource.id,
                    'assetId': asset.id,
                    'date': $scope.auditdate,
                    'checked': true
                };

                asset.resourceId = $scope.resource.id;

                HomeService.addLink(token, $scope.link,
                        function (response) {
                            if (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description + ". Please logout!";
                                } else {
                                    if (response.success) {
                                        parentScope.loadPage(asset.typeId);
                                        $scope.saveAsset(asset.typeId);
                                    } else {
                                        $scope.message = response.message;
                                    }
                                }
                            } else {
                                $scope.error = "Invalid server response";
                            }
                        }
                );
            };

            $scope.saveAsset = function (typeId) {
                HomeService.save(
                        token,
                        typeId,
                        asset,
                        function (response) {
                            // token auth error
                            if (response.error_description) {
                                $scope.error = response.error_description + ". Please logout!";
                            } else {
                                // asset type success or error
                                if (response.success === true) {
                                    $modalInstance.close();
                                } else {
                                    $scope.error = response.message;
                                }
                            }
                        }
                );
            };

            $scope.openDatePickers = [];

            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return (mode === 'day'
                        && (date.getDay() === 0
                                || date.getDay() === 6));
            };


            $scope.openDate = function ($event, datePickerIndex) {
                $event.preventDefault();
                $event.stopPropagation();

                if ($scope.openDatePickers[datePickerIndex] === true) {
                    $scope.openDatePickers.length = 0;
                } else {
                    $scope.openDatePickers.length = 0;
                    $scope.openDatePickers[datePickerIndex] = true;
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

