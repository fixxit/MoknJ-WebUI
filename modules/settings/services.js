'use strict';

angular.module('Settings')
        .factory(
                'SettingsCall',
                [
                    '$http',
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
                    }
                ]
                );