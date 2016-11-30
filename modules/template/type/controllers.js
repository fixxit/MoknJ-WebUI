'use strict';

angular.module('Type')
        .controller('TypeController',
                ['$scope', '$rootScope', '$location', 'TypeService',
                    function ($scope, $rootScope, $location, TypeService) {
                        // Retrieve all field detail data types via type service
                        // REST controller method types /fields
                        $scope.id = $location.search().id;
                        $scope.menuId = $location.search().menuId ? $location.search().menuId : null;

                        $scope.selectedItem = {'name': 'nosec', 'type': 'no selection'};
                        $scope.modules = [];

                        $scope.loadModules = function () {
                            TypeService.getTemplateTypes(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {

                                            $scope.loading = true;
                                            if (response.templateTypes) {
                                                $scope.modules = response.templateTypes;
                                            }
                                            $scope.loading = false;
                                        }
                                    }
                            );
                        };


                        $scope.loadPage = function () {
                            $scope.loadModules();
                            TypeService.getFieldTypes(
                                    $rootScope.globals.currentUser.access_token,
                                    $scope.process
                                    );
                        };

                        $scope.process = function (loadpageResponse) {
                            $scope.loading = true;
                            if (loadpageResponse) {
                                if (loadpageResponse.error_description) {
                                    $scope.error = loadpageResponse.error_description + ". Please logout!";
                                } else {
                                    if (loadpageResponse.fieldTypes) {
                                        $scope.types = loadpageResponse.fieldTypes;
                                        if ($scope.id) {
                                            TypeService.getType(
                                                    $rootScope.globals.currentUser.access_token,
                                                    $scope.id,
                                                    function (response) {
                                                        $scope.loading = true;
                                                        if (response.type) {
                                                            $scope.type = response.type;
                                                            $scope.typename = $scope.type.name;
                                                            $scope.index = $scope.type.index;
                                                            $scope.templateType = $scope.type.templateType;

                                                            angular.forEach($scope.type.details, function (detail) {
                                                                angular.forEach($scope.types, function (type) {
                                                                    if (detail.type === type.name) {
                                                                        $scope.items.push(
                                                                                {
                                                                                    'id': detail.id,
                                                                                    'type': type,
                                                                                    'name': detail.name,
                                                                                    'unique': detail.unique,
                                                                                    'display': detail.display,
                                                                                    'mandatory': detail.mandatory
                                                                                }
                                                                        );
                                                                    }
                                                                });
                                                            });
                                                        }
                                                        $scope.loading = false;
                                                    }
                                            );
                                        }
                                    }
                                }
                            } else {
                                $scope.error = "Invalid server response";
                            }
                            $scope.loading = false;
                        };

                        $scope.loadPage();

                        $scope.edit = function (index) {
                            $scope.selectedItem = $scope.items[index].type;
                            $scope.dispname = $scope.items[index].name;
                            $scope.unique = $scope.items[index].unique;
                            $scope.mandatory = $scope.items[index].mandatory;
                            $scope.display = $scope.items[index].display;
                            $scope.selectIndex = index;

                            if ($scope.selectedItem.name === 'ASSET_INPUT_DRD_TYPE') {
                                var n = $scope.dispname.indexOf(":");
                                var json = $scope.dispname.substring(n + 1, $scope.dispname.length);
                                var name = $scope.dispname.substring(0, n);

                                console.log("json : " + json);
                                $scope.dropdownName = name;
                                $scope.dropdownvalues = JSON.parse(json);
                            } else {
                                $scope.dropdownvalues = [];
                                $scope.dropdownName = $scope.items[index].name;
                                $scope.dropdown = null;
                            }
                        };

                        // items in the field detail list
                        $scope.dropdownvalues = [];
                        $scope.drpbutton = 'Add';
                        $scope.addDpdValue = function () {
                            if ($scope.dropdownName) {
                                if ($scope.dropdown) {
                                    var index = $scope.dropdownvalues.indexOf($scope.dropdown);
                                    var hasValue = parseInt(index) >= 0
                                            || parseInt(index) !== -1;
                                    if (!hasValue) {
                                        if ($scope.drpIndex == null) {
                                            $scope.dropdownvalues.push($scope.dropdown);
                                        } else {
                                            $scope.dropdownvalues[$scope.drpIndex] = $scope.dropdown;
                                        }
                                        $scope.drpError = null;
                                        $scope.dropdown = null;
                                        $scope.drpbutton = 'Add';
                                        $scope.dispname = $scope.dropdownName + ":" + JSON.stringify($scope.dropdownvalues);
                                    } else {
                                        $scope.drpError = 'No duplicate values allowed in dropdown list';
                                    }
                                } else {
                                    $scope.drpError = 'Please give a value for your dropdown list';
                                }
                            } else {
                                $scope.drpError = 'Please give a name for your dropdown';
                            }
                        };

                        // remove item by index from items
                        $scope.removeDrp = function (index) {
                            if ($scope.dropdownName) {
                                $scope.dropdownvalues.splice(index, 1);
                                $scope.dispname = $scope.dropdownName + ":" + JSON.stringify($scope.dropdownvalues);
                            } else {
                                $scope.drpError = 'Please give a name for your dropdown';
                            }
                        };

                        $scope.drpIndex = null;
                        $scope.editDrp = function (index) {
                            $scope.drpIndex = index;
                            $scope.dropdown = $scope.dropdownvalues[index];
                            $scope.drpbutton = 'Update';
                        };

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
                                if ($scope.selectIndex != null) {
                                    $scope.items[$scope.selectIndex].type = $scope.selectedItem;
                                    $scope.items[$scope.selectIndex].name = $scope.dispname;
                                    $scope.items[$scope.selectIndex].unique = $scope.unique;
                                    $scope.items[$scope.selectIndex].mandatory = $scope.mandatory;
                                    $scope.items[$scope.selectIndex].display = $scope.display;
                                } else {
                                    $scope.items.push(
                                            {
                                                'type': $scope.selectedItem,
                                                'name': $scope.dispname,
                                                'unique': $scope.unique,
                                                'mandatory': $scope.mandatory,
                                                'display': $scope.display
                                            }
                                    );
                                }
                                $scope.dropdownvalues = [];
                                $scope.dropdownName = null;
                                $scope.dropdown = null;
                                $scope.dispname = '';
                                $scope.selectIndex = null;
                                $scope.unique = false;
                                $scope.mandatory = false;
                                $scope.display = false;
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
                            if (value % 2 === 0) {
                                return "";//"info";
                            } else {
                                return "active";
                            }
                        };

                        $scope.isOkOrRemove = function (unique) {
                            if (unique) {
                                return "glyphicon glyphicon-ok";
                            } else {
                                return "glyphicon glyphicon-remove";
                            }
                        };


                        // reset input boxes
                        $scope.cancel = function () {
                            // Reset all data
                            $scope.selectIndex = null;
                            $scope.dispname = '';
                            $scope.templateType = null;
                            $scope.unique = false;
                            $scope.display = false;
                            $scope.mandatory = false;
                            $scope.dropdownvalues = [];
                            $scope.dropdownName = null;
                            $scope.dropdown = null;
                            $scope.drpbutton = 'Add';
                            $scope.selectedItem = {'name': 'nosec', 'type': 'no selection'};
                        };


                        // reset input boxes
                        $scope.reset = function (messages) {
                            // Reset all data
                            $scope.type = {};
                            $scope.items = [];
                            $scope.typename = '';
                            $scope.dispname = '';
                            $scope.templateType = null;
                            $scope.unique = false;
                            $scope.display = false;
                            $scope.mandatory = false;
                            $scope.dropdownvalues = [];
                            $scope.dropdownName = null;
                            $scope.dropdown = null;
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
                                if ($scope.type) {
                                    $scope.type.details = [];
                                    $scope.type.name = $scope.typename;
                                    $scope.type.index = $scope.index;
                                    $scope.type.templateType = $scope.templateType;
                                } else {
                                    $scope.type = {
                                        'details': [],
                                        'name': $scope.typename,
                                        'index': $scope.index,
                                        'templateType': $scope.templateType
                                    };
                                }
                                // loop items and add items to type.details array
                                angular.forEach($scope.items, function (value) {
                                    if (value.id) {
                                        $scope.type.details.push(
                                                {
                                                    'id': value.id,
                                                    'type': value.type.name,
                                                    'name': value.name,
                                                    'unique': value.unique,
                                                    'mandatory': value.mandatory,
                                                    'display': value.display
                                                }
                                        );
                                    } else {
                                        $scope.type.details.push(
                                                {
                                                    'type': value.type.name,
                                                    'name': value.name,
                                                    'unique': value.unique,
                                                    'mandatory': value.mandatory,
                                                    'display': value.display
                                                }
                                        );
                                    }
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
                                                if (response.success) {
                                                    //success
                                                    if (!$scope.id) {
                                                        $scope.success = 'Successfully saved a new asset type, create new type ?';
                                                    } else {
                                                        $location.path('/home');
                                                    }

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

