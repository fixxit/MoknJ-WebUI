'use strict';

angular.module('Asset')
        .factory('AssetService',
                ['$http',
                    function ($http) {
                        var service = {};
                        var baseURL = 'http://localhost:8080/asset/';

                        service.getDetail = function (token, id, callback) {
                            $http({
                                method: 'POST',
                                url: baseURL + 'type/get/' + id + '?access_token=' + token,
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
                        
                        service.get = function (token, id, callback) {
                            $http({
                                method: 'POST',
                                url: baseURL + 'get/' + id + '?access_token=' + token,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        };
                        
                        service.save = function (token, id, data, callback) {
                            $http({
                                method: 'POST',
                                url: baseURL + 'add/' + id + '?access_token=' + token,
                                data: JSON.stringify(data),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function (response) {
                                callback(response);
                            }).error(function (response) {
                                callback(response);
                            });
                        };
                        

                        return service;
                    }]);