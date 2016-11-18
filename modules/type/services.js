'use strict';

angular.module('Type')
        .factory('TypeService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};
                        var url = $rootScope.globalAppUrl;

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
                                url: url + 'type/add?access_token=' + token,
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
                                    url + 'type/fields?access_token=' + token,
                                    callback);
                        };

                        service.getType = function (token, id, callback) {
                            service.porcess(
                                    url + 'type/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        service.hidden = function (token, callback) {
                            service.porcess(
                                    url + 'type/hidden/?access_token=' + token,
                                    callback);

                        };

                        service.unhide = function (token, id, callback) {
                            service.porcess(url + 'type/unhide/' + id
                                    + '?access_token=' + token,
                                    callback);
                        };

                        service.delete = function (token, id, callback) {
                            service.porcess(url + 'type/delete/' + id
                                    + '?access_token=' + token
                                    + '&cascade=' + true,
                                    callback);
                        };

                        return service;
                    }]);