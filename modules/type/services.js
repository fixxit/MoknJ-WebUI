'use strict';

angular.module('Type')
        .factory('TypeService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};
                        var url = $rootScope.globalAppUrl + 'asset/type/';

                        service.porcess = function (command, callback) {
                            $http({
                                method: 'POST',
                                url: command,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        };

                        service.save = function (item, token, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'add?access_token=' + token,
                                data: JSON.stringify(item),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        };

                        service.getFieldTypes = function (token, callback) {
                            service.porcess(
                                    url + 'fields?access_token=' + token,
                                    callback);
                        };

                        service.getType = function (token, id, callback) {
                            service.porcess(
                                    url + 'get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        service.hidden = function (token, callback) {
                            service.porcess(
                                    url + 'hidden/?access_token=' + token,
                                    callback);

                        };

                        service.unhide = function (token, id, callback) {
                            service.porcess(url + 'unhide/' + id
                                    + '?access_token=' + token,
                                    callback);
                        };

                        service.delete = function (token, id, callback) {
                            service.porcess(url + 'delete/' + id
                                    + '?access_token=' + token
                                    + '&cascade=' + true,
                                    callback);
                        };

                        return service;
                    }]);