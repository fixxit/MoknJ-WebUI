'use strict';

angular.module('Menu')
        .factory('ApiMenuCall',
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

angular.module('Menu')
        .factory('MenuService',
                ['ApiMenuCall',
                    function (ApiMenuCall) {
                        var service = {};

                        service.getAllTypes = function (token, callback) {
                            ApiMenuCall.process(
                                    'type/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getMenu = function (token, id, callback) {
                            ApiMenuCall.process(
                                    'menu/get/' + id +
                                    '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.deleteMenu = function (token, id, callback) {
                            ApiMenuCall.process(
                                    'menu/delete/' + id +
                                    '?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.saveMenu = function (token, menu, callback) {
                            ApiMenuCall.process(
                                    'menu/add?access_token=' + token,
                                    menu,
                                    callback);
                        };

                        service.getAllMenus = function (token, callback) {
                            ApiMenuCall.process(
                                    'menu/all?access_token=' + token,
                                    null,
                                    callback);
                        };

                        service.getAllModules = function (token, callback) {
                            ApiMenuCall.process(
                                    'menu/types?access_token=' + token,
                                    null,
                                    callback);
                        };

                        return service;
                    }]);