'use strict';

angular.module('Home')
        .factory('HomeService',
                ['$http',
                    function ($http) {
                        var service = {};
                        var url = 'http://localhost:8080/asset/';

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


                        service.deleteAsset = function (token, asset, callback) {
                            $http.post((url + 'delete/?access_token=' + token),
                                    JSON.stringify(asset))
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

                        return service;
                    }]);