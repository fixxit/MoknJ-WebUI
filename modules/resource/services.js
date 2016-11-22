'use strict';

angular.module('Resource')
        .factory('ApiResourceCall',
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

angular.module('Resource')
        .factory('ResourceService',
                ['ApiResourceCall',
                    function (ApiResourceCall) {
                        var service = {};

                        service.get = function (token, id, callback) {
                            ApiResourceCall.process(
                                    'resource/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, data, callback) {
                            ApiResourceCall.process(
                                    'resource/add/?access_token=' + token,
                                    data,
                                    callback);
                        };

                        service.authorities = function (token, callback) {
                            ApiResourceCall.process(
                                    'resource/authorities?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.all = function (token, callback) {
                            ApiResourceCall.process(
                                    'resource/get/all/?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.remove = function (token, id, callback) {
                            ApiResourceCall.process(
                                    'resource/delete/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);