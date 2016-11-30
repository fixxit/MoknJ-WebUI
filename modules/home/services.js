'use strict';

angular.module('Home')
        .factory('ApiHomeCall',
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

angular.module('Home')
        .factory('HomeService',
                ['ApiHomeCall',
                    function (ApiHomeCall) {
                        var service = {};

                        service.getAllTypes = function (token, callback) {
                            ApiHomeCall.process(
                                    'type/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getAllMenus = function (token, callback) {
                            ApiHomeCall.process(
                                    'menu/all?access_token=' + token,
                                    null,
                                    callback);
                        };


                        service.getMenu = function (token, id, callback) {
                            ApiHomeCall.process(
                                    'menu/get/' + id +
                                    '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.deleteTemplate = function (token, id, cascade, callback) {
                            ApiHomeCall.process(
                                    'type/delete/' + id + '?access_token='
                                    + token + '&cascade=' + cascade,
                                    null,
                                    callback);
                        };

                        service.getAllAssetForType = function (token, id, callback) {
                            ApiHomeCall.process(
                                    'asset/get/all/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.deleteAsset = function (token, payload, callback) {
                            ApiHomeCall.process(
                                    'asset/delete/?access_token=' + token,
                                    payload,
                                    callback);
                        };

                        service.addLink = function (token, payload, callback) {
                            ApiHomeCall.process(
                                    'link/add?access_token=' + token,
                                    payload,
                                    callback);
                        };

                        service.all = function (token, callback) {
                            ApiHomeCall.process(
                                    'resource/get/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, id, data, callback) {
                            ApiHomeCall.process(
                                    'asset/add/' + id + '?access_token=' + token,
                                    data,
                                    callback);
                        };

                        service.getResource = function (token, id, callback) {
                            ApiHomeCall.process(
                                    'resource/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);