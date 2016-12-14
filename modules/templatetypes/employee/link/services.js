'use strict';

angular.module('EmployeeLink')
        .factory('ApiEmployeeLinkCall',
                ['$http',
                    function ($http) {
                        var service = {};
                        service.process = function (url, callback) {
                            $http.get("../settings.json").success(
                                    function (response) {
                                        $http.post(response.api_url + url)
                                                .success(
                                                        function (response) {
                                                            callback(response);
                                                        })
                                                .error(
                                                        function (response) {
                                                            callback(response);
                                                        }
                                                );
                                    }
                            );
                        };

                        return service;
                    }]);

angular.module('EmployeeLink')
        .factory('EmployeeLinkService',
                ['ApiEmployeeLinkCall',
                    function (ApiEmployeeLinkCall) {
                        var service = {};

                        service.allEmployeeLinksForEmployeeId = function (token, id, callback) {
                            ApiEmployeeLinkCall.process(
                                    'link/employee/all/' + id + '/employee?access_token=' + token,
                                    callback);
                        };


                        service.allEmployeeLink = function (token, callback) {
                            ApiEmployeeLinkCall.process(
                                    'link/employee/all/?access_token=' + token,
                                    callback);
                        };

                        return service;
                    }]);