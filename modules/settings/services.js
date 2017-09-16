'use strict';

angular.module('Settings')
        .factory(
                'SettingsCall',
                [
                    '$http',
                    function ($http) {
                        var service = {};
                        service.process = function (url, payload, callback) {
                            if (payload) {
                                service.complexHttpCall(url, payload, callback);
                            } else {
                                service.simpleHttpCall(url, callback);
                            }
                        };

                        service.complexHttpCall = function (url, payload, callback) {
                            $http({
                                method: 'POST',
                                url: "/api",
                                data: JSON.stringify(payload),
                                headers: {
                                    'apiUrl': url,
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        };

                        service.simpleHttpCall = function (url, callback) {
                            $http({
                                method: 'POST',
                                url: "/api",
                                headers: {
                                    'apiUrl': url,
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });

                        };

                        return service;
                    }
                ]
                );