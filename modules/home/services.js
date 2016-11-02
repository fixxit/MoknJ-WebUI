'use strict';

angular.module('Home')
        .factory('HomeService',
                ['$http', '$rootScope',
                    function ($http, $rootScope) {
                        var service = {};
                        var url = $rootScope.globalAppUrl + 'asset/';

                        service.getAllTypes = function (token, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'type/all' + '?access_token=' + token,
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

                        service.getAllAssetForType = function (token, id, callback) {
                            $http.post(url + 'get/all/' + id + '?access_token=' + token)
                                    .success(
                                            function (response) {
                                                callback(response);
                                            })
                                    .error(
                                            function (response) {
                                                callback(response);
                                            }
                                    );
                        };


                        service.deleteAsset = function (token, payload, callback) {
                            $http.post((url + 'delete/?access_token=' + token),
                                    JSON.stringify(payload))
                                    .success(
                                            function (response) {
                                                callback(response);
                                            })
                                    .error(
                                            function (response) {
                                                callback(response);
                                            }
                                    );
                        };
                        
                        
                        service.addLink = function (token, payload, callback) {
                            $http.post((url + '/link/add?access_token=' + token),
                                    JSON.stringify(payload))
                                    .success(
                                            function (response) {
                                                callback(response);
                                            })
                                    .error(
                                            function (response) {
                                                callback(response);
                                            }
                                    );
                        };
                        
                        
                        service.all = function (token, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'resource/all/?access_token=' + token,
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
                                url: url + 'add/' + id + '?access_token=' + token,
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
                        
                        
                        service.getResource = function (token, id, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'resource/get/' + id + '?access_token=' + token,
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