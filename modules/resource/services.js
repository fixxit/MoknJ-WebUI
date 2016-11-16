'use strict';

angular.module('Resource')
        .factory('ResourceService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};
                        var baseURL = $rootScope.globalAppUrl + 'asset/resource/';

                        service.process = function (url, payload, callback) {
                            if (payload) {
                                $http({
                                    method: 'POST',
                                    url: url,
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
                                $http.post(url)
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
                        };

                        service.get = function (token, id, callback) {
                            service.process(
                                    baseURL + 'get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, data, callback) {
                            service.process(
                                    baseURL + 'add/?access_token=' + token,
                                    data,
                                    callback);
                        };

                        service.all = function (token, callback) {
                            service.process(
                                    baseURL + 'all/?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.remove = function (token, id, callback) {
                            service.process(
                                    baseURL + 'delete/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);