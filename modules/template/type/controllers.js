'use strict';

angular.module('Type')
        .controller('TypeController',
                ['$scope', '$rootScope', '$location', 'TypeService',
                    function ($scope, $rootScope, $location, TypeService) {
                        // Retrieve all field detail data types via type service
                        // REST controller method types /fields
                        $scope.id = $location.search().id;
                        $scope.new = $location.search().new ? $location.search().new : null;
                        $scope.menuId = $location.search().menuId ? $location.search().menuId : null;
                        $scope.origin = $location.search().origin ? $location.search().origin : null;
                        $scope.selectedItem = {'name': 'nosec', 'type': 'no selection'};
                        $scope.modules = [];
                        // items in the field detail list
                        $scope.dropdownvalues = [];
                        $scope.drpbutton = 'Add';
                        // items in the field detail list
                        $scope.items = [];
                        $scope.drpIndex = null;
                        // type object
                        $scope.type = {};
                        // Pagination 
                        $scope.pagination = {};

                        $scope.loadPage = function () {
                            $scope.loading = true;
                            $scope.loadModules(function (modules) {
                                $scope.modules = modules;
                                $scope.loadTemplates(modules);
                            });

                            TypeService.getFieldTypes(
                                    $rootScope.globals.currentUser.access_token,
                                    $scope.process
                                    );

                            if ($scope.new) {
                                $scope.newCollapse = true;
                            }
                        };

                        $scope.loadModules = function (callback) {
                            TypeService.getTemplateTypes(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            callback(response.templateTypes);
                                        }
                                    }
                            );
                        };

                        $scope.loadTemplates = function (modules) {
                            TypeService.getAllTemplates($rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                if ("Access is denied" !== response.error_description) {
                                                    $scope.error = response.error_description + ". Please logout!";
                                                }
                                            } else {
                                                if (response.types) {
                                                    // do not refresh the entire structure
                                                    $scope.templates = response.types;
                                                    // Set module names
                                                    angular.forEach(modules, function (module) {
                                                        angular.forEach($scope.templates, function (template) {
                                                            if (template.templateType === module.name) {
                                                                template.templateType = module.type;
                                                            }
                                                        });
                                                    });

                                                    $scope.pagination.viewby = 5;
                                                    $scope.pagination.totalItems = response.types.length;
                                                    $scope.pagination.currentPage = 1;
                                                    $scope.pagination.itemsPerPage = 5;
                                                    $scope.pagination.maxSize = 5;
                                                } else {
                                                    $scope.error = "Invalid server response";
                                                }
                                            }
                                        } else {
                                            $scope.error = "Invalid server response";
                                        }
                                        $scope.loading = false;
                                    }
                            );
                        }

                        $scope.editTemplate = function (template) {
                            $scope.loading = true;
                            $scope.editvalue = true;
                            $scope.reset();
                            $scope.id = template.id;
                            TypeService.getFieldTypes(
                                    $rootScope.globals.currentUser.access_token,
                                    $scope.process
                                    );
                            $scope.newCollapse = true;
                        };

                        $scope.process = function (loadpageResponse) {
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
                                                        if (response.type) {
                                                            $scope.type = response.type;
                                                            $scope.typename = $scope.type.name;
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

                        $scope.edit = function (index) {
                            $scope.selectedItem = $scope.items[index].type;
                            $scope.dispname = $scope.items[index].name;
                            $scope.unique = $scope.items[index].unique;
                            $scope.mandatory = $scope.items[index].mandatory;
                            $scope.display = $scope.items[index].display;
                            $scope.selectIndex = index;

                            if ($scope.selectedItem.name === 'GBL_INPUT_DRP_TYPE') {
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

                        // Move item up or down in the array index
                        $scope.moveDrp = function (old_index, new_index) {
                            while (old_index < 0) {
                                old_index += $scope.dropdownvalues.length;
                            }
                            while (new_index < 0) {
                                new_index += $scope.dropdownvalues.length;
                            }
                            if (new_index >= this.length) {
                                var k = new_index - $scope.dropdownvalues.length;
                                while ((k--) + 1) {
                                    $scope.dropdownvalues.push(undefined);
                                }
                            }
                            $scope.dropdownvalues.splice(new_index, 0, $scope.dropdownvalues.splice(old_index, 1)[0]);
                        };

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
                                        $scope.drpIndex = null;
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

                        $scope.editDrp = function (index) {
                            $scope.drpIndex = index;
                            $scope.dropdown = $scope.dropdownvalues[index];
                            $scope.drpbutton = 'Update';
                        };
                        // selected item desplayed in div
                        $scope.dropboxitemselected = function (item) {
                            $scope.selectedItem = item;
                        };
                        // adding item to the array items
                        $scope.add = function () {
                            // input check
                            if ($scope.selectedItem.name !== 'nosec'
                                    && ($scope.dispname && $scope.dispname.trim() !== '')) {
                                if ($scope.selectedItem.name === 'GBL_INPUT_DRP_TYPE') {
                                    $scope.dispname = $scope.dropdownName + ":" + JSON.stringify($scope.dropdownvalues);
                                }

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

                        $scope.submit = function () {
                            if ($scope.templateType) {
                                if ($scope.items.length > 0) {
                                    // define type array with details
                                    if ($scope.type) {
                                        $scope.type.details = [];
                                        $scope.type.name = $scope.typename;
                                        $scope.type.templateType = $scope.templateType;
                                    } else {
                                        $scope.type = {
                                            'details': [],
                                            'name': $scope.typename,
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
                                                    // template type success or error
                                                    if (response.success) {
                                                        if (!$scope.editvalue) {
                                                            //success
                                                            if (!$scope.id) {
                                                                $scope.success = 'Successfully saved a new template, create new type ?';
                                                            } else {
                                                                if ($scope.menuId) {
                                                                    if ($scope.origin === 'employee') {
                                                                        $location.path('/home').search(
                                                                                {
                                                                                    'id': $scope.menuId,
                                                                                    'templateId': $scope.id
                                                                                }
                                                                        );
                                                                    } else {
                                                                        $location.path('/home').search(
                                                                                {'id': $scope.menuId}
                                                                        );
                                                                    }
                                                                } else {
                                                                    $location.path('/home');
                                                                }
                                                            }

                                                            $scope.error = null;
                                                            $scope.dataLoading = false;
                                                            // Reset all data
                                                            $scope.reset();
                                                        } else {
                                                            $scope.newCollapse = false;
                                                            $scope.success = 'Successfully updated template!';
                                                            $scope.error = null;
                                                            $scope.dataLoading = false;
                                                            $scope.id = null;
                                                            // Reset all data
                                                            $scope.reset();
                                                        }
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
                                    $scope.error = "no template type fields provided";
                                }
                            } else {
                                // No module/template type selected...
                                $scope.success = null;
                                $scope.error = "no module selected for this template";
                            }
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

                        // check if even for row odd and even colors
                        $scope.isExpanded = function () {
                            if (!$scope.newCollapse) {
                                return "glyphicon glyphicon-collapse-down";//"info";
                            } else {
                                return "glyphicon glyphicon-collapse-up";
                            }
                        };

                        $scope.loadPage();
                    }]);

