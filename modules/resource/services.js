'use strict';

angular.module('Resource')
        .factory('ResourceService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};

                        $http.get('../settings.json').success(
                                function (response) {
                                    $rootScope.globalAppUrl = response.api_url;
                                    $rootScope.auth_user = response.auth_user;
                                    $rootScope.auth_psw = response.auth_psw;
                                });

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
                                    $rootScope.globalAppUrl + 'resource/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, data, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'resource/add/?access_token=' + token,
                                    data,
                                    callback);
                        };

                        service.authorities = function (token, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'resource/authorities?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.all = function (token, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'resource/get/all/?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.remove = function (token, id, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'resource/delete/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);