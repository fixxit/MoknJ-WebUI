'use strict';

angular.module('Home')
        .factory('HomeService',
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

                        service.getAllTypes = function (token, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'type/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.deleteTemplate = function (token, id, cascade, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'type/delete/' + id + '?access_token='
                                    + token + '&cascade=' + cascade,
                                    null,
                                    callback);
                        };

                        service.getAllAssetForType = function (token, id, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'asset/get/all/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.deleteAsset = function (token, payload, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'asset/delete/?access_token=' + token,
                                    payload,
                                    callback);
                        };

                        service.addLink = function (token, payload, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'link/add?access_token=' + token,
                                    payload,
                                    callback);
                        };

                        service.all = function (token, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'resource/get/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, id, data, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'asset/add/' + id + '?access_token=' + token,
                                    data,
                                    callback);
                        };

                        service.getResource = function (token, id, callback) {
                            service.process(
                                    $rootScope.globalAppUrl + 'resource/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);