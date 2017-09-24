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
                    }).then((response) => {
                        callback(response.data);
                    }, (error) => {
                        callback(error.data);
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
                    }).then((response) => {
                        callback(response.data);
                    }, (error) => {
                        callback(error.data);
                    });

                };

                return service;
            }
        ]
        );