'use strict';

angular.module('Home')
        .factory('HomeService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};
                        var url = $rootScope.globalAppUrl;

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
                                    url + 'type/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.deleteTemplate = function (token, id, cascade, callback) {
                            service.process(
                                    url + 'type/delete/' + id + '?access_token='
                                    + token + '&cascade=' + cascade,
                                    null,
                                    callback);
                        };

                        service.getAllAssetForType = function (token, id, callback) {
                            service.process(
                                    url + 'asset/get/all/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.deleteAsset = function (token, payload, callback) {
                            service.process(
                                    url + 'asset/delete/?access_token=' + token,
                                    payload,
                                    callback);
                        };

                        service.addLink = function (token, payload, callback) {
                            service.process(
                                    url + 'link/add?access_token=' + token,
                                    payload,
                                    callback);
                        };

                        service.all = function (token, callback) {
                            service.process(
                                    url + 'resource/get/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, id, data, callback) {
                            service.process(
                                    url + 'asset/add/' + id + '?access_token=' + token,
                                    data,
                                    callback);
                        };

                        service.getResource = function (token, id, callback) {
                            service.process(
                                    url + 'resource/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);