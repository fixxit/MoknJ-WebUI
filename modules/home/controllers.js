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

                                                type.viewby = 5;
                                                type.totalItems = response.assets.length;
                                                type.currentPage = 1;
                                                type.itemsPerPage = type.viewby;
                                                type.maxSize = 5; //Number of pager buttons to show
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.refreshAsset = function (asset, load_resource) {
                            angular.forEach($scope.types, function (type) {
                                if (type.id === asset.typeId) {
                                    angular.forEach(type.assets,
                                            function (type_asset) {
                                                if (type_asset.id === asset.id) {
                                                    type_asset = asset;
                                                    if (load_resource) {
                                                        $scope.loadResource(type_asset);
                                                    } else {
                                                        type_asset.linkedResource = null;
                                                        type_asset.resource = {};
                                                    }
                                                }
                                            }
                                    );
                                }
                            });
                        };

                        // remove item by index from items
                        $scope.removeFromList = function (asset, index) {
                            angular.forEach($scope.types, function (type) {
                                if (type.id === asset.typeId) {
                                    type.assets.splice(index, 1);
                                }
                            });
                        };

                        $scope.formatDate = function (date) {
                            var year = date.getFullYear();
                            var month = (1 + date.getMonth()).toString();
                            month = month.length > 1 ? month : '0' + month;
                            var day = date.getDate().toString();
                            day = day.length > 1 ? day : '0' + day;
                            return year + '-' + month + '-' + day;
                        };

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
                        };

                        $scope.deleteTemplate = function (id, cascade, token, callback) {
                            if (id) {
                                HomeService.deleteTemplate(
                                        token,
                                        id,
                                        cascade,
                                        function (response) {
                                            // token auth error
                                            if (response.error_description) {
                                                $scope.error = response.error_description + ". Please logout!";
                                            } else {
                                                callback();
                                            }
                                        }
                                );
                            }
                        };

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
                        };

                        $scope.loadPage();

                        // check if even for row odd and even colors
                        $scope.isEven = function (value) {
                            if (value % 2 === 0) {
                                return "success";
                            } else {
                                return "active";
                            }
                        };

                        $scope.isCollapsed = function (newCollapse) {
                            if (newCollapse) {
                                return "glyphicon glyphicon-collapse-down";
                            } else {
                                return "glyphicon glyphicon-collapse-up";
                            }
                        };

                        $scope.edit = function (id, assetId) {
                            $location.path('/asset').search({'id': id, 'assetId': assetId});
                        };

                        $scope.editType = function (id) {
                            $location.path('/type').search({'id': id});
                        };

                        $scope.newAsset = function (id) {
                            $location.path('/asset').search({'id': id});
                        };

                        $scope.viewAudit = function (id, name) {
                            $location.path('/link').search({'assetId': id, 'name': name});
                        };

                        $scope.removeAsset = function (asset, name, index) {
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
                                    },
                                    index: function () {
                                        return index;
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
        function ($scope, $modalInstance, parentScope, HomeService, asset, name, token, index) {
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
                                        parentScope.removeFromList(asset, index);
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
        function ($scope, $modalInstance, parentScope, type, token) {
            $scope.name = type.name;
            $scope.cascade = false;

            $scope.ok = function () {
                $scope.dataLoading = true;
                parentScope.deleteTemplate(type.id, $scope.cascade, token,
                        function () {
                            parentScope.loadPage();
                            $modalInstance.close();
                        }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

angular.module('Home').controller('ModalRemoveLinkCtrl',
        function ($scope, $modalInstance, parentScope, HomeService, asset, name, token) {
            $scope.name = name + " - Check Asset In";

            $scope.ok = function () {
                $scope.dataLoading = true;
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
                                        $scope.saveAsset(
                                                asset.typeId,
                                                function (response_asset) {
                                                    parentScope.refreshAsset(response_asset, false);
                                                    $modalInstance.close();
                                                }
                                        );
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

            $scope.saveAsset = function (typeId, callback) {
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
                                    callback(asset);
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


angular.module('Home').filter('filterAssetMultiple', ['$filter', function ($filter) {
        return function (items, values, type) {
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
                        type.searchSize = results.length;
                        var checkedOut = 0;
                        angular.forEach(results, function (result) {
                            if (result.linkedResource) {
                                checkedOut = checkedOut + 1;
                            }
                        });
                        type.checkedOut = checkedOut;
                        type.checkedIn = type.searchSize - checkedOut;
                        items = results.slice(
                                ((type.currentPage - 1) * type.itemsPerPage),
                                ((type.currentPage) * type.itemsPerPage)
                                );
                    }
                }
            }
            return items;
        };
    }]);


angular.module('Home').controller('ModalAssignAssetCtrl',
        function ($scope, $modalInstance, parentScope, HomeService, asset, name, token) {
            $scope.name = name + " - Check Asset Out";
            $scope.asset = asset;
            $scope.resources = [];
            $scope.selected = 'Select an Resource';
            $scope.resource = {};
            $scope.date = "";

            // selected item desplayed in div
            $scope.dropboxitemselected = function (resource) {
                $scope.selected = resource.fullname;
                $scope.resource = resource;
                $scope.resourceCollapse = !$scope.resourceCollapse;
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


            // check if even for row odd and even colors
            $scope.isEven = function (value) {
                return parentScope.isEven(value);
            };


            $scope.loadPage();
            $scope.ok = function () {
                if (date != null) {
                    $scope.showDateIsRequired = true;
                } else {
                    $scope.showDateIsRequired = false;
                }

                if ('Select an Resource' === $scope.selected) {
                    $scope.showResourceIsRequired = true;
                } else {
                    $scope.showResourceIsRequired = false;
                }
                if (!$scope.showResourceIsRequired
                        && !$scope.showResourceIsRequired) {
                    $scope.dataLoading = true;
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
                                            $scope.saveAsset(
                                                    asset.typeId,
                                                    function (response_asset) {
                                                        parentScope.refreshAsset(response_asset, true);
                                                        $modalInstance.close();
                                                    }
                                            );
                                        } else {
                                            $scope.message = response.message;
                                        }
                                    }
                                } else {
                                    $scope.error = "Invalid server response";
                                }
                            }
                    );
                }
            };

            $scope.saveAsset = function (typeId, callback) {
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
                                    callback(asset);
                                } else {
                                    $scope.error = response.message;
                                }
                            }
                        }
                );
            };

            $scope.resourceCollapse = false;

            $scope.changeDiv = function () {
                $scope.resourceCollapse = !$scope.resourceCollapse;
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

