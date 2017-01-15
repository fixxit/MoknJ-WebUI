'use strict';

angular.module('Graph')
        .controller('GraphController',
                ['$scope', '$rootScope', '$location', 'GraphService', '$modal',
                    function ($scope, $rootScope, $location, GraphService, $modal) {
                        $scope.id = $location.search().id ? $location.search().id : null;
                        $scope.menuId = $location.search().menuId ? $location.search().menuId : null;
                        $scope.origin = $location.search().origin ? $location.search().origin : null;
                        $scope.newCollapse = true;
                        $scope.resetDate = true;
                        $scope.graph = null;


                        $scope.pagination = {};
                        // logic for navigation between pages...
                        $scope.urlScope = {
                            'url': '/home',
                            'return_parms': null
                        };

                        // logic for navigation between pages...
                        $scope.initialiseUrlParms = function () {
                            if ($scope.id) {
                                $scope.urlScope.return_parms = {
                                    'id': $scope.menuId,
                                    'templateId': $scope.id
                                };
                            } else {
                                $scope.urlScope.return_parms = {
                                    'id': $scope.menuId
                                };
                            }
                        };

                        // Execeutes the url
                        $scope.executeURL = function () {
                            $scope.initialiseUrlParms();
                            // execute location change!
                            if (!$scope.urlScope.return_parms) {
                                $location.path($scope.urlScope.url);
                            } else {
                                $location.path($scope.urlScope.url)
                                        .search($scope.urlScope.return_parms);
                            }
                        };

                        $scope.loadPage = function () {
                            $scope.loading = true;
                            $scope.name = 'Setup Home Dashboard';

                            $scope.loadTemplates();
                            $scope.loadMenus();
                            $scope.loadGraphTypes();
                            $scope.loadGraphViews();
                            $scope.loadSavedGraphs();
                            $scope.loadGraphDateTypes();

                            $scope.loading = false;
                        };

                        // check if even for row odd and even colors
                        $scope.isExpanded = function () {
                            if ($scope.newCollapse) {
                                return "glyphicon glyphicon-collapse-down";//"info";
                            } else {
                                return "glyphicon glyphicon-collapse-up";
                            }
                        };

                        $scope.loadSavedGraphs = function () {
                            GraphService.getAllSavedGraphs(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            console.log("response : " + JSON.stringify(response));
                                            if (response.savedGraphs) {
                                                $scope.savedGraphs = response.savedGraphs;

                                                angular.forEach($scope.savedGraphs, function (graph) {
                                                    if (graph.graphDate) {
                                                        $scope.formatDate(graph);
                                                    }
                                                });

                                                $scope.pagination.totalItems = response.savedGraphs.length;
                                                $scope.pagination.currentPage = 1;
                                                $scope.pagination.itemsPerPage = 10;
                                                $scope.pagination.maxSize = 10;
                                                $scope.pagination.viewby = 10;
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.submit = function () {
                            GraphService.saveGraph(
                                    $rootScope.globals.currentUser.access_token,
                                    $scope.graph,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            if (response.success) {
                                                $scope.success = response.message;
                                                $scope.loadSavedGraphs();
                                                $scope.reset();
                                            } else {
                                                $scope.error = response.message;
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.editGraph = function (graph) {
                            $scope.resetDate = false;
                            $scope.reset();
                            $scope.graph = graph;
                            $scope.newCollapse = false;
                        };

                        $scope.removeGraph = function (graph) {
                            $modal.open({
                                backdrop: true,
                                templateUrl: '../modules/graph/templates/delete.html',
                                controller: 'ModalDeleteGraphCtrl',
                                resolve: {
                                    parentScope: function () {
                                        return $scope;
                                    },
                                    graph: function () {
                                        return graph;
                                    }
                                }
                            });
                        };

                        $scope.deleteGraph = function (graph, callback) {
                            GraphService.deleteGraph(
                                    $rootScope.globals.currentUser.access_token,
                                    graph.id,
                                    function (response) {
                                        if (response.error_description) {
                                            callback(false, response.error_description);
                                        } else {
                                            callback(true);
                                        }
                                    }
                            );
                        };

                        // remove item by index from items
                        $scope.removeFromList = function (graph) {
                            var index = $scope.savedGraphs.indexOf(graph);
                            $scope.savedGraphs.splice(index, 1);
                        };

                        // reset input boxes
                        $scope.reset = function () {
                            $scope.graph = null;
                        };

                        $scope.loadMenus = function () {
                            GraphService.getAllMenus(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            if (response.menus) {
                                                //
                                                $scope.menus = response.menus;
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.filterTemplate = function (types) {
                            angular.forEach($scope.menus, function (menu) {
                                if ($scope.graph.menuId === menu.id) {
                                    var templates = [];
                                    angular.forEach(menu.templates, function (template) {
                                        angular.forEach(types, function (type) {
                                            if (type.id === template.id) {
                                                templates.push(template);
                                            }
                                        });
                                    });
                                    $scope.types = templates;
                                }
                            });
                        };

                        $scope.reloadTemplates = function (callback) {
                            GraphService.getAllTemplates($rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                if ("Access is denied" !== response.error_description) {
                                                    $scope.error = response.error_description + ". Please logout!";
                                                }
                                            } else {
                                                if (response.types) {
                                                    callback(response.types);
                                                }
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.loadTemplates = function () {
                            GraphService.getAllTemplates($rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        if (response) {
                                            if (response.error_description) {
                                                if ("Access is denied" !== response.error_description) {
                                                    $scope.error = response.error_description + ". Please logout!";
                                                }
                                            } else {
                                                if (response.types) {
                                                    $scope.types = response.types;
                                                }
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.loadGraphTypes = function () {
                            GraphService.getGraphTypes(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            if (response.graphTypes) {
                                                $scope.graphTypes = response.graphTypes;
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.loadGraphViews = function () {
                            GraphService.getGraphViews(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            if (response.graphViews) {
                                                $scope.graphViews = response.graphViews;
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.loadGraphDateTypes = function () {
                            GraphService.getGraphDateTypes(
                                    $rootScope.globals.currentUser.access_token,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            if (response.graphDates) {
                                                $scope.graphDates = response.graphDates;
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.loadGraphFocus = function (id) {
                            GraphService.getGraphFocuses(
                                    $rootScope.globals.currentUser.access_token,
                                    id,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            console.log("focuses : " + JSON.stringify(response));
                                            if (response.graphFocuses) {
                                                $scope.graphFocuses = response.graphFocuses;
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.loadTemplateFields = function (id) {
                            GraphService.getTempFields(
                                    $rootScope.globals.currentUser.access_token,
                                    id,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            console.log("Template Fields : " + JSON.stringify(response));
                                            if (response.fields) {
                                                $scope.templateFields = response.fields;
                                            }
                                        }
                                    }
                            );
                        };

                        $scope.loadTemplateDateFields = function (id) {
                            GraphService.getTempDateFields(
                                    $rootScope.globals.currentUser.access_token,
                                    id,
                                    function (response) {
                                        // token auth error
                                        if (response.error_description) {
                                            $scope.error = response.error_description + ". Please logout!";
                                        } else {
                                            console.log("Template Fields : " + JSON.stringify(response));
                                            if (response.fields) {
                                                $scope.templateDateFields = response.fields;
                                            }
                                        }
                                    }
                            );
                        };

                        // check if even for row odd and even colors
                        $scope.isEven = function (value) {
                            if (value % 2 === 0) {
                                return "";//"info";
                            } else {
                                return "active";
                            }
                        };

                        $scope.formatDate = function (graph) {
                            var date = new Date(graph.graphDate);
                            var year = date.getFullYear();
                            var month = (1 + date.getMonth()).toString();
                            month = month.length > 1 ? month : '0' + month;
                            var day = date.getDate().toString();
                            day = day.length > 1 ? day : '0' + day;

                            if (graph.graphView === 'GBL_MTMTFY') {
                                graph.formatedDate = "Year : " + year;
                            } else if (graph.graphView === 'GBL_MTMFD') {
                                graph.formatedDate = year + '-' + month + '-' + day;
                            } else if (graph.graphView === 'GBL_SMTEOM') {
                                graph.formatedDate = "Month : " + month + ", Year : " + year;
                            } else if (graph.graphView === 'GBL_SYTEOY') {
                                graph.formatedDate = "Year : " + date.getFullYear();
                            } else if (graph.graphView === 'GBL_SYTD') {
                                graph.formatedDate = year + '-' + month + '-' + day;
                            } else if (graph.graphView === 'GBL_DOWFY') {
                                graph.formatedDate = "Year : " + year;
                            } else if (graph.graphView === 'GBL_DOWFM') {
                                graph.formatedDate = "Month : " + month + ", Year : " + year;
                            } else if (graph.graphView === 'GBL_OFTD') {
                                graph.formatedDate = "N/A";
                            }
                        };

                        $scope.dateOptions = {
                            year: {
                                datepickerMode: "'year'",
                                minMode: "'year'",
                                minDate: "minDate",
                                showWeeks: "false",
                                format: "yyyy",
                                open: false
                            },
                            day: {
                                datepickerMode: "'day'",
                                minMode: "'day'",
                                minDate: "minDate",
                                showWeeks: "false",
                                format: "dd",
                                open: false
                            },
                            month: {
                                datepickerMode: "'month'",
                                minMode: "'month'",
                                minDate: "minDate",
                                showWeeks: "false",
                                format: "MMMM",
                                open: false
                            },
                            normal: {
                                minDate: "minDate",
                                showWeeks: "true",
                                format: "dd-MMMM-yyyy",
                                open: false
                            }
                        };

                        $scope.datepickerOptions = null;

                        $scope.openCal = function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.datepickerOptions.open = true;
                        };

                        // Change state watches for dropdown values.


                        $scope.$watch('graph.menuId', function () {
                            if ($scope.graph
                                    && $scope.graph.menuId) {
                                $scope.reloadTemplates(function (types) {
                                    $scope.filterTemplate(types);
                                });
                            }
                        });

                        $scope.$watch('graph.templateId', function () {
                            if ($scope.graph && $scope.graph.templateId) {
                                $scope.loadGraphFocus($scope.graph.templateId);
                                if ($scope.graph.graphFocus
                                        && $scope.graph.graphFocus === "GBL_FOCUS_FREE_FIELD") {
                                    $scope.loadTemplateFields($scope.graph.templateId)
                                }

                                if ($scope.graph.graphDateType
                                        && $scope.graph.graphDateType === "GBL_FOCUS_FREE_FIELD") {
                                    $scope.loadTemplateDateFields($scope.graph.templateId);
                                }
                            }
                        });

                        $scope.$watch('graph.graphFocus', function () {
                            if ($scope.graph
                                    && $scope.graph.graphFocus
                                    && $scope.graph.templateId) {
                                if ($scope.graph.graphFocus === "GBL_FOCUS_FREE_FIELD") {
                                    $scope.loadTemplateFields($scope.graph.templateId);
                                }
                            }
                        });

                        $scope.$watch('graph.graphDateType', function () {
                            if ($scope.graph
                                    && $scope.graph.graphDateType
                                    && $scope.graph.templateId) {
                                if ($scope.graph.graphDateType === "GBL_FOCUS_FREE_FIELD") {
                                    $scope.loadTemplateDateFields($scope.graph.templateId);
                                }
                            }
                        });

                        $scope.$watch('graph.graphView', function () {
                            if ($scope.graph && $scope.graph.graphView) {
                                if ($scope.resetDate) {
                                    $scope.datepickerOptions = null;
                                    $scope.graph.graphDate = null;
                                }
                                if ($scope.graph.graphView === 'GBL_MTMTFY') {
                                    $scope.datepickerOptions = $scope.dateOptions.year;
                                } else if ($scope.graph.graphView === 'GBL_MTMFD') {
                                    $scope.datepickerOptions = $scope.dateOptions.normal;
                                } else if ($scope.graph.graphView === 'GBL_SMTEOM') {
                                    $scope.datepickerOptions = $scope.dateOptions.month;
                                } else if ($scope.graph.graphView === 'GBL_SYTEOY') {
                                    $scope.datepickerOptions = $scope.dateOptions.year;
                                } else if ($scope.graph.graphView === 'GBL_SYTD') {
                                    $scope.datepickerOptions = $scope.dateOptions.normal;
                                } else if ($scope.graph.graphView === 'GBL_DOWFY') {
                                    $scope.datepickerOptions = $scope.dateOptions.year;
                                } else if ($scope.graph.graphView === 'GBL_DOWFM') {
                                    $scope.datepickerOptions = $scope.dateOptions.month;
                                } else if ($scope.graph.graphView === 'GBL_OFTD') {
                                    $scope.datepickerOptions = $scope.dateOptions.none;
                                }
                            } else {
                                $scope.datepickerOptions = $scope.dateOptions.normal;
                            }
                        });

                        $scope.loadPage();
                    }]);
