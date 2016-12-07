'use strict';

angular.module('Employee')
        .factory('ApiEmployeeCall',
                ['$http',
                    function ($http) {
                        var service = {};
                        service.process = function (url, payload, callback) {
                            $http.get("../settings.json").success(
                                    function (response) {
                                        if (payload) {
                                            $http({
                                                method: 'POST',
                                                url: response.api_url + url,
                                                data: JSON.stringify(payload),
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                }
                                            }).success(function (response) {
                                                callback(response);
                                            }).error(function (response) {
                                                callback(response);
                                            });
                                        } else {
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
                                    }
                            );
                        };

                        return service;
                    }]);

angular.module('Employee')
        .factory('EmployeeService',
                ['ApiEmployeeCall',
                    function (ApiEmployeeCall) {
                        var service = {};

                        service.getDetail = function (token, id, callback) {
                            ApiEmployeeCall.process(
                                    'type/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.get = function (token, id, callback) {
                            ApiEmployeeCall.process(
                                    'employee/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, id, data, callback) {
                            ApiEmployeeCall.process(
                                    'employee/add/' + id + '?access_token=' + token,
                                    data,
                                    callback);
                        };

                        service.allResources = function (token, callback) {
                            ApiEmployeeCall.process(
                                    'resource/get/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);