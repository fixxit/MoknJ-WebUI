'use strict';

angular.module('Authentication')
        .controller('LoginController',
                ['$scope', '$location', 'AuthenticationService',
                    function ($scope, $location, AuthenticationService) {
                        // reset login status
                        AuthenticationService.ClearCredentials();
                        $scope.login = function () {
                            $scope.dataLoading = true;
                            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                                if (response.error_description) {
                                    $scope.error = response.error_description;
                                } else {
                                    if (response.access_token) {
                                        AuthenticationService.SetCredentials(
                                                $scope.username,
                                                $scope.password,
                                                response.access_token,
                                                response.refresh_token,
                                                response.expires_in);
                                        console.log("location is set to home");
                                        $location.path('/home');
                                    } else {
                                        $scope.error = "Invalid server response [102]";
                                        console.log("no access token recieved ");
                                    }
                                }

                                $scope.dataLoading = false;
                                console.log("response : " + JSON.stringify(response));
                            });
                        };
                    }]);