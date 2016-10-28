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


                    }]);