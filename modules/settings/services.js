'use strict';

angular.module('Settings').factory(
        'SettingsCall',
        [
            '$http',
            ($http) => {
                var service = {};
                service.process = (url, payload, callback) => {
                    if (payload) {
                        service.complexHttpCall(url, payload, callback);
                    } else {
                        service.simpleHttpCall(url, callback);
                    }
                };

                service.complexHttpCall = (url, payload, callback) => {
                    $http({
                        method: 'POST',
                        url: "/api",
                        data: JSON.stringify(payload),
                        headers: {
                            'apiUrl': url,
                            'Content-Type': 'application/json'
                        }
                    }).success((response) => {
                        callback(response);
                    }).error((response) => {
                        callback(response);
                    });
                };

                service.simpleHttpCall = (url, callback) => {
                    $http({
                        method: 'POST',
                        url: "/api",
                        headers: {
                            'apiUrl': url,
                            'Content-Type': 'application/json'
                        }
                    }).success((response) => {
                        callback(response);
                    }).error((response) => {
                        callback(response);
                    });

                };

                return service;
            }
        ]
        );