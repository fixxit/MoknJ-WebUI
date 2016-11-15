'use strict';

angular.module('Type')
        .factory('TypeService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};
                        var url = $rootScope.globalAppUrl + 'asset/type/';
                        service.getFieldTypes = function (token, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'fields?access_token=' + token,
                                data: {},
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        };


                        service.getType = function (token, id, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'get/' + id + '?access_token=' + token,
                                data: {},
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

                        service.hidden = function (token, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'hidden/?access_token=' + token,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        };


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