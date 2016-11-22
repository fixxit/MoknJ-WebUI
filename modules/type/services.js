'use strict';

angular.module('Type')
        .factory('TypeService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};
                        $http.get('../settings.json').success(
                                function (response) {
                                    $rootScope.globalAppUrl = response.api_url;
                                    $rootScope.auth_user = response.auth_user;
                                    $rootScope.auth_psw = response.auth_psw;
                                });

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
                                url: $rootScope.globalAppUrl + 'type/add?access_token=' + token,
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
                                    $rootScope.globalAppUrl + 'type/fields?access_token=' + token,
                                    callback);
                        };

                        service.getType = function (token, id, callback) {
                            service.porcess(
                                    $rootScope.globalAppUrl + 'type/get/' + id + '?access_token=' + token,
                                    callback);
                        };

                        service.hidden = function (token, callback) {
                            service.porcess(
                                    $rootScope.globalAppUrl + 'type/hidden/?access_token=' + token,
                                    callback);

                        };

                        service.unhide = function (token, id, callback) {
                            service.porcess($rootScope.globalAppUrl + 'type/unhide/' + id
                                    + '?access_token=' + token,
                                    callback);
                        };

                        service.delete = function (token, id, callback) {
                            service.porcess($rootScope.globalAppUrl + 'type/delete/' + id
                                    + '?access_token=' + token
                                    + '&cascade=' + true,
                                    callback);
                        };

                        return service;
                    }]);