'use strict';

angular.module('Authentication')
        .controller('LoginController',
                ['$scope', '$rootScope', '$location', 'AuthenticationService',
                    function ($scope, $rootScope, $location, AuthenticationService) {
                        // reset login status
                        AuthenticationService.ClearCredentials();
                        $scope.login = function () {
                            $scope.dataLoading = true;
                            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description;
                                } else {
                                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                                    console.log("location is set to home");
                                    $location.path('/home');
                                }

                                $scope.dataLoading = false;
                                console.log("response : " + JSON.stringify(response));
                            });
                        };
                    }]);