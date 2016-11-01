'use strict';

angular.module('Resource')
        .factory('ResourceService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};
                        
                        var baseURL = $rootScope.globalAppUrl + 'asset/resource/';

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
                        
                        
                        service.save = function (token, data, callback) {
                            $http({
                                method: 'POST',
                                url: baseURL + 'add/?access_token=' + token,
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
                        
                        
                        service.all = function (token, callback) {
                            $http({
                                method: 'POST',
                                url: baseURL + 'all/?access_token=' + token,
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