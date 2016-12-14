'use strict';

angular.module('Link')
        .factory('ApiLinkCall',
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

angular.module('Link')
        .factory('LinkService',
                ['ApiLinkCall',
                    function (ApiLinkCall) {
                        var service = {};

                        service.allLinkForAssetId = function (token, id, callback) {
                            ApiLinkCall.process(
                                    'link/asset/all/' + id + '/asset?access_token=' + token,
                                    callback);
                        };

                        service.allLinkForResourceId = function (token, id, callback) {
                            ApiLinkCall.process(
                                    'link/asset/all/' + id + '/resource?access_token=' + token,
                                    callback);
                        };

                        service.allLink = function (token, callback) {
                            ApiLinkCall.process(
                                    'link/asset/all/?access_token=' + token,
                                    callback);
                        };

                        service.getResource = function (token, id, callback) {
                            ApiLinkCall.process(
                                    'resource/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        service.getAsset = function (token, id, callback) {
                            ApiLinkCall.process(
                                    'asset/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        service.getDetail = function (token, id, callback) {
                            ApiLinkCall.process(
                                    'type/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        return service;
                    }]);