'use strict';

angular.module('Type')
        .factory('ApiTypeCall',
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

angular.module('Type')
        .factory('TypeService',
                ['ApiTypeCall',
                    function (ApiTypeCall) {
                        var service = {};

                        service.save = function (item, token, callback) {
                            ApiTypeCall.process('type/add?access_token=' + token,
                                    item,
                                    callback);

                        };

                        service.getAllTemplates = function (token, callback) {
                            ApiTypeCall.process('type/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getFieldTypes = function (token, callback) {
                            ApiTypeCall.process('type/fields?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getTemplateTypes = function (token, callback) {
                            ApiTypeCall.process('type/templates?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getType = function (token, id, callback) {
                            ApiTypeCall.process('type/get/' + id + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.hidden = function (token, callback) {
                            ApiTypeCall.process('type/hidden/?access_token=' + token,
                                    null,
                                    callback);

                        };

                        service.unhide = function (token, id, callback) {
                            ApiTypeCall.process('type/unhide/' + id
                                    + '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.delete = function (token, id, callback) {
                            ApiTypeCall.process('type/delete/' + id
                                    + '?access_token=' + token
                                    + '&cascade=' + true,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);