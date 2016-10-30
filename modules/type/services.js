'use strict';

angular.module('Type')
        .factory('TypeService',
                ['$http',
                    function ($http) {
                        var service = {};
                        var url = 'http://localhost:8080/asset/type/';
                        service.getFieldTypes = function (token, callback) {
                            $http({
                                method: 'POST',
                                url: url + 'fields' + '?access_token=' + token,
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
                                url: url + 'add' + '?access_token=' + token,
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


                        return service;
                    }]);