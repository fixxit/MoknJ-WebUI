'use strict';

angular.module('Asset')
        .factory('AssetService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};
                        var baseURL = $rootScope.globalAppUrl + 'asset/';

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

                        service.getDetail = function (token, id, callback) {
                            service.process(
                                    baseURL + 'type/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.get = function (token, id, callback) {
                            service.process(
                                    baseURL + 'get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, id, data, callback) {
                            service.process(
                                    baseURL + 'add/' + id + '?access_token=' + token,
                                    data,
                                    callback);
                        };


                        return service;
                    }]);