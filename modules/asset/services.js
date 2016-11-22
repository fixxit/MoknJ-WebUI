'use strict';

angular.module('Asset')
        .factory('ApiAssetCall',
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

angular.module('Asset')
        .factory('AssetService',
                ['ApiAssetCall',
                    function (ApiAssetCall) {
                        var service = {};

                        service.getDetail = function (token, id, callback) {
                            ApiAssetCall.process(
                                    'type/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.get = function (token, id, callback) {
                            ApiAssetCall.process(
                                    'asset/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.save = function (token, id, data, callback) {
                            ApiAssetCall.process(
                                    'asset/add/' + id + '?access_token=' + token,
                                    data,
                                    callback);
                        };


                        return service;
                    }]);